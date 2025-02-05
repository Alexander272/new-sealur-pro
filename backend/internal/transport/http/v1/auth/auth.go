package auth

import (
	"errors"
	"fmt"
	"net/http"
	"strings"

	"github.com/Alexander272/new-sealur-pro/internal/config"
	"github.com/Alexander272/new-sealur-pro/internal/constants"
	"github.com/Alexander272/new-sealur-pro/internal/models"
	"github.com/Alexander272/new-sealur-pro/internal/models/response"
	"github.com/Alexander272/new-sealur-pro/internal/services"
	"github.com/Alexander272/new-sealur-pro/internal/transport/http/middleware"
	"github.com/Alexander272/new-sealur-pro/pkg/error_bot"
	"github.com/Alexander272/new-sealur-pro/pkg/logger"
	"github.com/gin-gonic/gin"
)

type Handler struct {
	services *services.Services
	conf     config.AuthConfig
}

type Deps struct {
	Services   *services.Services
	Conf       config.AuthConfig
	Middleware *middleware.Middleware
}

func NewHandler(deps *Deps) *Handler {
	return &Handler{
		conf:     deps.Conf,
		services: deps.Services,
	}
}

func Register(api *gin.RouterGroup, deps *Deps) {
	handlers := NewHandler(deps)

	auth := api.Group("/auth")
	{
		auth.POST("/sign-in", handlers.signIn)
		auth.POST("/sign-out", deps.Middleware.VerifyToken, handlers.signOut)
		auth.POST("/sign-up", handlers.signUp)
		auth.POST("refresh", handlers.refresh)
	}
}

func (h *Handler) signIn(c *gin.Context) {
	dto := &models.SignInDTO{}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	limit, err := h.services.Limit.Get(c, c.ClientIP())
	if err != nil && !errors.Is(err, models.ErrClientIPNotFound) {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	if limit != nil && limit.Count >= h.conf.CountAttempt {
		h.services.Limit.AddAttempt(c, c.ClientIP())
		response.NewErrorResponse(
			c, http.StatusTooManyRequests,
			fmt.Sprintf("too many request (%d >= %d)", limit.Count, h.conf.CountAttempt),
			fmt.Sprintf("Много некорректных запросов. Доступ заблокирован на %.0f минут", h.conf.LimitAuthTTL.Minutes()),
		)
		return
	}

	user, err := h.services.Session.SignIn(c, dto)
	if err != nil {
		logger.Info("Неудачная попытка авторизации",
			logger.StringAttr("section", "auth"),
			logger.StringAttr("ip", c.ClientIP()),
			logger.StringAttr("username", dto.Username),
			logger.ErrAttr(err),
		)

		if strings.Contains(err.Error(), "invalid_grant") {
			h.services.Limit.AddAttempt(c, c.ClientIP())
			response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
			return
		}
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), dto)
		return
	}
	h.services.Limit.Remove(c, c.ClientIP())

	domain := h.conf.Domain
	if !strings.Contains(c.Request.Host, domain) {
		domain = c.Request.Host
	}

	logger.Info("Пользователь успешно авторизовался",
		logger.StringAttr("section", "auth"),
		logger.StringAttr("ip", c.ClientIP()),
		logger.StringAttr("user", user.Name),
		logger.StringAttr("user_id", user.Id),
	)

	c.SetSameSite(http.SameSiteLaxMode)
	if user.Realm == "public" {
		c.SetCookie(constants.AuthPublicCookie, user.RefreshToken, int(h.conf.RefreshTokenTTL.Seconds()), "/", domain, h.conf.Secure, true)
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: user})
}

func (h *Handler) signOut(c *gin.Context) {
	refreshToken, err := c.Cookie(constants.AuthPublicCookie)
	if err != nil {
		response.NewErrorResponse(c, http.StatusUnauthorized, err.Error(), "Сессия не найдена")
		return
	}

	u, exists := c.Get(constants.CtxUser)
	if !exists {
		response.NewErrorResponse(c, http.StatusUnauthorized, "empty user", "сессия не найдена")
		return
	}
	user := u.(models.User)

	// realm := "public"
	dto := &models.SignOutDTO{
		RefreshToken: refreshToken,
		Realm:        user.Realm,
	}

	if err := h.services.Session.SignOut(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), dto)
		return
	}

	domain := h.conf.Domain
	if !strings.Contains(c.Request.Host, domain) {
		domain = c.Request.Host
	}

	logger.Info("Пользователь вышел из системы",
		logger.StringAttr("section", "auth"),
		logger.StringAttr("ip", c.ClientIP()),
	)

	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie(constants.AuthPublicCookie, "", -1, "/", domain, h.conf.Secure, true)
	c.JSON(http.StatusNoContent, response.IdResponse{})
}

func (h *Handler) signUp(c *gin.Context) {
	dto := &models.SignUpDTO{}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.services.Session.SignUp(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusOK, response.IdResponse{Message: "Пользователь успешно зарегистрирован"})
}

func (h *Handler) refresh(c *gin.Context) {
	refreshToken, err := c.Cookie(constants.AuthPublicCookie)
	if err != nil {
		response.NewErrorResponse(c, http.StatusUnauthorized, err.Error(), "Сессия не найдена")
		return
	}
	realm := "public"
	dto := &models.RefreshDTO{
		RefreshToken: refreshToken,
		Realm:        realm,
	}

	user, err := h.services.Session.Refresh(c, dto)
	if err != nil {
		if strings.Contains(err.Error(), "invalid_grant") {
			response.NewErrorResponse(c, http.StatusUnauthorized, err.Error(), "Сессия не найдена")
			return
		}
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), dto)
		return
	}

	domain := h.conf.Domain
	if !strings.Contains(c.Request.Host, domain) {
		domain = c.Request.Host
	}

	logger.Info("Пользователь успешно обновил сессию",
		logger.StringAttr("section", "auth"),
		logger.StringAttr("ip", c.ClientIP()),
		logger.StringAttr("user", user.Name),
		logger.StringAttr("user_id", user.Id),
	)

	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie(constants.AuthPublicCookie, user.RefreshToken, int(h.conf.RefreshTokenTTL.Seconds()), "/", domain, h.conf.Secure, true)
	c.JSON(http.StatusOK, response.DataResponse{Data: user})
}

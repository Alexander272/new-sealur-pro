package users

import (
	"errors"
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
	"github.com/google/uuid"
)

type Handler struct {
	service services.User
	session services.Session
	conf    config.AuthConfig
}

type Deps struct {
	Services   *services.Services
	Conf       config.AuthConfig
	Middleware *middleware.Middleware
}

func NewHandler(service services.User, session services.Session, conf config.AuthConfig) *Handler {
	return &Handler{
		service: service,
		session: session,
		conf:    conf,
	}
}

func Register(api *gin.RouterGroup, deps *Deps) {
	handler := NewHandler(deps.Services.User, deps.Services.Session, deps.Conf)

	users := api.Group("/users")
	{
		users.POST("/confirm/:code", handler.confirm)
		users.POST("/recovery", handler.recovery)
		users.POST("/recovery/:code", handler.upgradePass)

		auth := users.Group("", deps.Middleware.VerifyToken)
		{
			auth.GET("/:id", handler.getById)

			manager := auth.Group("", deps.Middleware.CheckAccess(constants.AllowManager))
			{
				manager.GET("/info/:id", handler.getInfoById)
				manager.GET("/managers", handler.getManagers)
				manager.POST("/manager/change", handler.changeManager)
			}
		}
	}
}

func (h *Handler) getById(c *gin.Context) {
	id := c.Param("id")
	if err := uuid.Validate(id); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "Идентификатор не задан")
		return
	}

	dto := &models.GetUserByIdDTO{Id: id}
	data, err := h.service.GetById(c, dto)
	if err != nil {
		if errors.Is(err, models.ErrUserNotFound) {
			response.NewErrorResponse(c, http.StatusNotFound, err.Error(), "Пользователь не найден")
			return
		}
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: data})
}

func (h *Handler) getInfoById(c *gin.Context) {
	id := c.Param("id")
	if err := uuid.Validate(id); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "Идентификатор не задан")
		return
	}

	dto := &models.GetUserByIdDTO{Id: id}
	data, err := h.service.GetInfoById(c, dto)
	if err != nil {
		if errors.Is(err, models.ErrUserNotFound) {
			response.NewErrorResponse(c, http.StatusNotFound, err.Error(), "Пользователь не найден")
			return
		}
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: data})
}

func (h *Handler) getManagers(c *gin.Context) {
	data, err := h.service.GetManagers(c, &models.GetManagersDTO{})
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка")
		error_bot.Send(c, err.Error(), nil)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: data, Total: len(data)})
}

func (h *Handler) confirm(c *gin.Context) {
	code := c.Param("code")
	if code == "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty code", "empty code param")
		return
	}

	user, err := h.service.Confirm(c, code)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка")
		error_bot.Send(c, err.Error(), code)
		return
	}

	if err := h.session.Create(c, user); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка")
		error_bot.Send(c, err.Error(), user)
		return
	}

	domain := h.conf.Domain
	if !strings.Contains(c.Request.Host, domain) {
		domain = c.Request.Host
	}

	c.SetSameSite(http.SameSiteLaxMode)
	if user.Realm == "public" {
		c.SetCookie(constants.AuthPublicCookie, user.RefreshToken, int(h.conf.RefreshTokenTTL.Seconds()), "/", domain, h.conf.Secure, true)
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: user})
}

func (h *Handler) changeManager(c *gin.Context) {
	dto := &models.ChangeManagerDTO{}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.SetManager(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	logger.Debug("Менеджер у клиента изменен", logger.AnyAttr("dto", dto))
	c.JSON(http.StatusOK, response.IdResponse{Message: "Менеджер изменен"})
}

func (h *Handler) recovery(c *gin.Context) {
	dto := &models.RecoveryDTO{}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.Recovery(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusOK, response.IdResponse{Message: "Письмо отправлено"})
}

func (h *Handler) upgradePass(c *gin.Context) {
	code := c.Param("code")
	if code == "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty code", "empty code param")
		return
	}

	dto := &models.UpgradePasswordDTO{Code: code}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.UpgradePassword(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusOK, response.IdResponse{Message: "Пароль успешно изменен"})
}

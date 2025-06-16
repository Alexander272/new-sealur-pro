package sizes

import (
	"net/http"

	"github.com/Alexander272/new-sealur-pro/internal/constants"
	"github.com/Alexander272/new-sealur-pro/internal/jacketed/models"
	"github.com/Alexander272/new-sealur-pro/internal/jacketed/services"
	"github.com/Alexander272/new-sealur-pro/internal/models/response"
	"github.com/Alexander272/new-sealur-pro/internal/transport/http/middleware"
	"github.com/Alexander272/new-sealur-pro/pkg/error_bot"
	"github.com/Alexander272/new-sealur-pro/pkg/logger"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type Handler struct {
	service services.Size
}

func NewHandler(service services.Size) *Handler {
	return &Handler{service: service}
}

func Register(api *gin.RouterGroup, service services.Size, middleware *middleware.Middleware) {
	handler := NewHandler(service)

	sizes := api.Group("/sizes")
	{
		sizes.GET("", handler.get)
		sizes.GET("/dn", handler.getDn)
		write := sizes.Group("", middleware.CheckAccess(constants.AllowAdmin))
		{
			write.POST("", handler.create)
			write.PUT("/:id", handler.update)
			write.DELETE("/:id", handler.delete)
		}
	}
}

func (h *Handler) getDn(c *gin.Context) {
	flange := c.Query("flange")
	if err := uuid.Validate(flange); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "Отправлены некорректные данные")
		return
	}

	req := &models.GetDnDTO{FlangeId: flange}
	data, err := h.service.GetDn(c, req)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось получить размеры")
		error_bot.Send(c, err.Error(), req)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: data, Total: len(data)})
}

func (h *Handler) get(c *gin.Context) {
	flange := c.Query("flange")
	if err := uuid.Validate(flange); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "Отправлены некорректные данные")
		return
	}
	dn := c.Query("dn")
	if dn == "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "Dn не задан")
		return
	}

	req := &models.GetSizeDTO{FlangeId: flange, Dn: dn}
	data, err := h.service.Get(c, req)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось получить данные")
		error_bot.Send(c, err.Error(), req)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: data, Total: len(data)})
}

func (h *Handler) create(c *gin.Context) {
	dto := &models.SizeDTO{}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.Create(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось создать размер")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	logger.Info("Размер создан", logger.AnyAttr("dto", dto))
	c.JSON(http.StatusCreated, response.IdResponse{Message: "Размер создан"})
}

func (h *Handler) update(c *gin.Context) {
	id := c.Param("id")
	if err := uuid.Validate(id); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "Идентификатор не задан")
		return
	}

	dto := &models.SizeDTO{}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}
	dto.Id = id

	if err := h.service.Update(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось обновить размер")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	logger.Info("Размер обновлен", logger.AnyAttr("dto", dto))
	c.JSON(http.StatusOK, response.IdResponse{Message: "Размер обновлен"})
}

func (h *Handler) delete(c *gin.Context) {
	id := c.Param("id")
	if err := uuid.Validate(id); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "Идентификатор не задан")
		return
	}

	if err := h.service.Delete(c, &models.DeleteSizeDTO{Id: id}); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось удалить размер")
		error_bot.Send(c, err.Error(), id)
		return
	}
	logger.Info("Размер удален", logger.StringAttr("id", id))
	c.JSON(http.StatusOK, response.IdResponse{Message: "Размер удален"})
}

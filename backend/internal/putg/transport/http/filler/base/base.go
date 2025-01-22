package base

import (
	"net/http"

	"github.com/Alexander272/new-sealur-pro/internal/models/response"
	"github.com/Alexander272/new-sealur-pro/internal/putg/models"
	"github.com/Alexander272/new-sealur-pro/internal/putg/services"
	"github.com/Alexander272/new-sealur-pro/internal/transport/http/middleware"
	"github.com/Alexander272/new-sealur-pro/pkg/error_bot"
	"github.com/Alexander272/new-sealur-pro/pkg/logger"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type Handler struct {
	service services.BaseFiller
}

func NewHandler(service services.BaseFiller) *Handler {
	return &Handler{service: service}
}

func Register(api *gin.RouterGroup, service services.BaseFiller, middleware *middleware.Middleware) {
	handler := NewHandler(service)

	base := api.Group("/base")
	{
		base.GET("", handler.get)
		// TODO только для админа
		base.POST("", handler.create)
		base.PUT("/:id", handler.update)
		base.DELETE("/:id", handler.delete)
	}
}

func (h *Handler) get(c *gin.Context) {
	data, err := h.service.Get(c, &models.GetBaseFillerDTO{})
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось получить базовые наполнители")
		error_bot.Send(c, err.Error(), nil)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: data, Total: len(data)})
}

func (h *Handler) create(c *gin.Context) {
	dto := &models.BaseFillerDTO{}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.Create(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось создать базовый наполнитель")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	logger.Info("Базовый наполнитель создан", logger.AnyAttr("dto", dto))
	c.JSON(http.StatusCreated, response.IdResponse{Message: "Базовый наполнитель создан"})
}

func (h *Handler) update(c *gin.Context) {
	id := c.Param("id")
	err := uuid.Validate(id)
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "Идентификатор не задан")
		return
	}

	dto := &models.BaseFillerDTO{}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}
	dto.Id = id

	if err := h.service.Update(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось обновить базовый наполнитель")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	logger.Info("Базовый наполнитель обновлен", logger.AnyAttr("dto", dto))
	c.JSON(http.StatusOK, response.IdResponse{Message: "Базовый наполнитель обновлен"})
}

func (h *Handler) delete(c *gin.Context) {
	id := c.Param("id")
	err := uuid.Validate(id)
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "Идентификатор не задан")
		return
	}

	if err := h.service.Delete(c, &models.DeleteBaseFillerDTO{Id: id}); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось удалить базовый наполнитель")
		error_bot.Send(c, err.Error(), id)
		return
	}
	logger.Info("Базовый наполнитель удален", logger.StringAttr("id", id))
	c.JSON(http.StatusOK, response.IdResponse{Message: "Базовый наполнитель удален"})
}

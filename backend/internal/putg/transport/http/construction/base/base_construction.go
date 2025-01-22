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
)

type Handler struct {
	service services.BaseConstruction
}

func NewHandler(service services.BaseConstruction) *Handler {
	return &Handler{service: service}
}

func Register(api *gin.RouterGroup, service services.BaseConstruction, middleware *middleware.Middleware) {
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
	data, err := h.service.Get(c, &models.GetBaseConstructionDTO{})
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось получить базовые конструкции")
		error_bot.Send(c, err.Error(), nil)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: data, Total: len(data)})
}

func (h *Handler) create(c *gin.Context) {
	dto := &models.BaseConstructionDTO{}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.Create(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось создать базовую конструкцию")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	logger.Info("Базовая конструкция создана", logger.AnyAttr("dto", dto))
	c.JSON(http.StatusCreated, response.IdResponse{Message: "Базовая конструкция создана"})
}

func (h *Handler) update(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "Идентификатор не задан")
		return
	}

	dto := &models.BaseConstructionDTO{}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}
	dto.Id = id

	if err := h.service.Update(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось обновить базовую конструкцию")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	logger.Info("Базовая конструкция обновлена", logger.AnyAttr("dto", dto))
	c.JSON(http.StatusOK, response.IdResponse{Message: "Базовая конструкция обновлена"})
}

func (h *Handler) delete(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "Идентификатор не задан")
		return
	}

	if err := h.service.Delete(c, &models.DeleteBaseConstructionDTO{Id: id}); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось удалить базовую конструкцию")
		error_bot.Send(c, err.Error(), id)
		return
	}
	logger.Info("Базовая конструкция удалена", logger.StringAttr("id", id))
	c.JSON(http.StatusOK, response.IdResponse{Message: "Базовая конструкция удалена"})
}

package filler

import (
	"net/http"

	"github.com/Alexander272/new-sealur-pro/internal/models/response"
	"github.com/Alexander272/new-sealur-pro/internal/putg/models"
	"github.com/Alexander272/new-sealur-pro/internal/putg/services"
	"github.com/Alexander272/new-sealur-pro/internal/putg/transport/http/filler/base"
	"github.com/Alexander272/new-sealur-pro/internal/transport/http/middleware"
	"github.com/Alexander272/new-sealur-pro/pkg/error_bot"
	"github.com/Alexander272/new-sealur-pro/pkg/logger"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type Handler struct {
	service services.Filler
}

func NewHandler(service services.Filler) *Handler {
	return &Handler{service: service}
}

func Register(api *gin.RouterGroup, services *services.Services, middleware *middleware.Middleware) {
	handler := NewHandler(services.Filler)

	filler := api.Group("/fillers")
	{
		filler.GET("", handler.get)
		// TODO только для админа
		filler.POST("", handler.create)
		filler.PUT("/:id", handler.update)
		filler.DELETE("/:id", handler.delete)
	}
	base.Register(filler, services.BaseFiller, middleware)
}

func (h *Handler) get(c *gin.Context) {
	standard := c.Query("standard")
	if standard == "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty params", "Отправлены некорректные данные")
		return
	}

	dto := &models.GetFillerDTO{
		StandardId: standard,
	}
	data, err := h.service.Get(c, dto)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось получить наполнители")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: data, Total: len(data)})
}

func (h *Handler) create(c *gin.Context) {
	dto := &models.FillerDTO{}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.Create(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось создать наполнитель")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	logger.Info("Наполнитель создан", logger.AnyAttr("dto", dto))
	c.JSON(http.StatusCreated, response.IdResponse{Message: "Наполнитель создан"})
}

func (h *Handler) update(c *gin.Context) {
	id := c.Param("id")
	err := uuid.Validate(id)
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "Идентификатор не задан")
		return
	}

	dto := &models.FillerDTO{}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}
	dto.Id = id

	if err := h.service.Update(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось обновить наполнитель")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	logger.Info("Наполнитель обновлен", logger.AnyAttr("dto", dto))
	c.JSON(http.StatusOK, response.IdResponse{Message: "Наполнитель обновлен"})
}

func (h *Handler) delete(c *gin.Context) {
	id := c.Param("id")
	err := uuid.Validate(id)
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "Идентификатор не задан")
		return
	}

	if err := h.service.Delete(c, &models.DeleteFillerDTO{Id: id}); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось удалить наполнитель")
		error_bot.Send(c, err.Error(), id)
		return
	}
	logger.Info("Наполнитель удален", logger.StringAttr("id", id))
	c.JSON(http.StatusOK, response.IdResponse{Message: "Наполнитель удален"})
}

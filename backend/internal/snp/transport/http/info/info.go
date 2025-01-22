package info

import (
	"net/http"

	"github.com/Alexander272/new-sealur-pro/internal/models/response"
	"github.com/Alexander272/new-sealur-pro/internal/snp/models"
	"github.com/Alexander272/new-sealur-pro/internal/snp/services"
	"github.com/Alexander272/new-sealur-pro/internal/transport/http/middleware"
	"github.com/Alexander272/new-sealur-pro/pkg/error_bot"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type Handler struct {
	service services.Info
}

func NewHandler(service services.Info) *Handler {
	return &Handler{
		service: service,
	}
}

func Register(api *gin.RouterGroup, service services.Info, middleware *middleware.Middleware) {
	handler := NewHandler(service)

	data := api.Group("/info")
	{
		data.GET("", handler.getByType)
		// TODO только для админа
		data.POST("", handler.create)
		data.PUT("/:id", handler.update)
		data.DELETE("/:id", handler.delete)
	}
}

func (h *Handler) getByType(c *gin.Context) {
	typeId := c.Query("typeId")
	if typeId == "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "тип снп не задан")
		return
	}

	data, err := h.service.GetByType(c, &models.GetInfoDTO{TypeId: typeId})
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось получить данные о прокладке")
		error_bot.Send(c, err.Error(), typeId)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: data})
}

func (h *Handler) create(c *gin.Context) {
	dto := &models.InfoDTO{}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.Create(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось добавить данные о прокладке")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusCreated, response.IdResponse{Message: "Данные о прокладке успешно добавлены"})
}

func (h *Handler) update(c *gin.Context) {
	id := c.Param("id")
	err := uuid.Validate(id)
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "идентификатор не задан")
		return
	}

	dto := &models.InfoDTO{}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}
	dto.Id = id

	if err := h.service.Update(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось обновить данные о прокладке")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusOK, response.IdResponse{Message: "Данные о прокладке успешно обновлены"})
}

func (h *Handler) delete(c *gin.Context) {
	id := c.Param("id")
	err := uuid.Validate(id)
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "идентификатор не задан")
		return
	}

	dto := &models.DeleteInfoDTO{Id: id}
	if err := h.service.Delete(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось удалить данные о прокладке")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusOK, response.IdResponse{Message: "Данные о прокладке успешно удален"})
}

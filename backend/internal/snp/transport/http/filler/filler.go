package filler

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
	service services.Filler
}

func NewHandler(service services.Filler) *Handler {
	return &Handler{
		service: service,
	}
}

func Register(api *gin.RouterGroup, service services.Filler, middleware *middleware.Middleware) {
	handler := NewHandler(service)

	fillers := api.Group("/fillers")
	{
		fillers.GET("", handler.getAll)
		// TODO только для админа
		fillers.POST("", handler.create)
		fillers.POST("/several", handler.createSeveral)
		fillers.PUT("/:id", handler.update)
		fillers.DELETE("/:id", handler.delete)
	}
}

func (h *Handler) getAll(c *gin.Context) {
	standardId := c.Query("standardId")
	if standardId == "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "стандарт не задан")
		return
	}

	fillers, err := h.service.GetAll(c, &models.GetFillerDTO{StandardId: standardId})
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось получить наполнители снп")
		error_bot.Send(c, err.Error(), standardId)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: fillers, Total: len(fillers)})
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
	c.JSON(http.StatusCreated, response.IdResponse{Message: "Наполнитель успешно создан"})
}

func (h *Handler) createSeveral(c *gin.Context) {
	var dto []*models.FillerDTO
	if err := c.BindJSON(&dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.CreateSeveral(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось создать наполнители")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusCreated, response.IdResponse{Message: "Наполнители успешно созданы"})
}

func (h *Handler) update(c *gin.Context) {
	id := c.Param("id")
	err := uuid.Validate(id)
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "идентификатор не задан")
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
	c.JSON(http.StatusOK, response.IdResponse{Message: "Наполнитель успешно обновлен"})
}

func (h *Handler) delete(c *gin.Context) {
	id := c.Param("id")
	err := uuid.Validate(id)
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "идентификатор не задан")
		return
	}

	if err := h.service.Delete(c, &models.DeleteFillerDTO{Id: id}); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось удалить наполнитель")
		error_bot.Send(c, err.Error(), id)
		return
	}
	c.JSON(http.StatusOK, response.IdResponse{Message: "Наполнитель успешно удален"})
}

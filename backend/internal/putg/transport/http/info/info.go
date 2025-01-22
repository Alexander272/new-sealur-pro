package info

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
	service services.Info
}

func NewHandler(service services.Info) *Handler {
	return &Handler{service: service}
}

func Register(api *gin.RouterGroup, service services.Info, middleware *middleware.Middleware) {
	handler := NewHandler(service)

	info := api.Group("/info")
	{
		info.GET("/by-filler", handler.getByFiller)
		info.GET("/by-construction", handler.getByConstruction)
		info.POST("", handler.create)
		info.PUT("/:id", handler.update)
		info.DELETE("/:id", handler.delete)
	}
}

func (h *Handler) getByFiller(c *gin.Context) {
	filler := c.Query("filler")
	if filler == "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty params", "Отправлены некорректные данные")
		return
	}

	dto := &models.GetInfoByFillerDTO{FillerId: filler}
	data, err := h.service.GetByFiller(c, dto)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось получить информацию о прокладке")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: data})
}

func (h *Handler) getByConstruction(c *gin.Context) {
	construction := c.Query("construction")
	if construction == "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty params", "Отправлены некорректные данные")
		return
	}

	dto := &models.GetInfoByConstructionDTO{ConstructionId: construction}
	data, err := h.service.GetByConstruction(c, dto)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось получить информацию о прокладках")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: data, Total: len(data)})
}

func (h *Handler) create(c *gin.Context) {
	dto := &models.InfoDTO{}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.Create(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось создать информацию о прокладке")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	logger.Info("Информация о прокладке создана", logger.AnyAttr("dto", dto))
	c.JSON(http.StatusCreated, response.IdResponse{Message: "Информация о прокладке создана"})
}

func (h *Handler) update(c *gin.Context) {
	id := c.Param("id")
	err := uuid.Validate(id)
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "Идентификатор не задан")
		return
	}

	dto := &models.InfoDTO{}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}
	dto.Id = id

	if err := h.service.Update(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось обновить информацию о прокладке")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	logger.Info("Информация о прокладке обновлена", logger.AnyAttr("dto", dto))
	c.JSON(http.StatusOK, response.IdResponse{Message: "Информация о прокладке обновлена"})
}

func (h *Handler) delete(c *gin.Context) {
	id := c.Param("id")
	err := uuid.Validate(id)
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "Идентификатор не задан")
		return
	}

	if err := h.service.Delete(c, &models.DeleteInfoDTO{Id: id}); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось удалить информацию о прокладке")
		error_bot.Send(c, err.Error(), id)
		return
	}
	logger.Info("Информация о прокладке удалена", logger.StringAttr("id", id))
	c.JSON(http.StatusOK, response.IdResponse{Message: "Информация о прокладке удалена"})
}

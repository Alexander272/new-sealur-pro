package standard_info

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
	service services.StandardInfo
}

func NewHandler(service services.StandardInfo) *Handler {
	return &Handler{
		service: service,
	}
}

func Register(api *gin.RouterGroup, service services.StandardInfo, middleware *middleware.Middleware) {
	handler := NewHandler(service)

	standard := api.Group("/standard-info")
	{
		standard.GET("", handler.getAll)
		standard.POST("", handler.create)
		standard.PUT("/:id", handler.update)
		standard.DELETE("/:id", handler.delete)
	}
}

func (h *Handler) getAll(c *gin.Context) {
	standards, err := h.service.GetAll(c, &models.GetStandardInfoDTO{})
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "something went wrong")
		error_bot.Send(c, err.Error(), nil)
		return
	}

	c.JSON(http.StatusOK, response.DataResponse{Data: standards, Total: len(standards)})
}

func (h *Handler) create(c *gin.Context) {
	dto := &models.StandardInfoDTO{}
	if err := c.BindJSON(&dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.Create(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось создать стандарт")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusCreated, response.IdResponse{Message: "Стандарт успешно создан"})
}

func (h *Handler) update(c *gin.Context) {
	id := c.Param("id")
	err := uuid.Validate(id)
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "empty id param")
		return
	}

	dto := &models.StandardInfoDTO{}
	if err := c.BindJSON(&dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}
	dto.Id = id

	if err := h.service.Update(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось обновить стандарт")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusOK, response.IdResponse{Message: "Стандарт успешно обновлен"})
}

func (h *Handler) delete(c *gin.Context) {
	id := c.Param("id")
	err := uuid.Validate(id)
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "empty id param")
		return
	}

	dto := &models.DeleteStandardInfoDTO{Id: id}
	if err := h.service.Delete(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось удалить стандарт")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusOK, response.IdResponse{Message: "Стандарт успешно удален"})
}

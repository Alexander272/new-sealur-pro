package size

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
	service services.Size
}

func NewHandler(service services.Size) *Handler {
	return &Handler{
		service: service,
	}
}

func Register(api *gin.RouterGroup, service services.Size, middleware *middleware.Middleware) {
	handler := NewHandler(service)

	sizes := api.Group("sizes")
	{
		sizes.GET("", handler.get)
		// TODO только для админа
		sizes.POST("", handler.create)
		sizes.POST("/several", handler.createSeveral)
		sizes.PUT("/:id", handler.update)
		sizes.DELETE("/:id", handler.delete)
	}
}

func (h *Handler) get(c *gin.Context) {
	typeId := c.Query("typeId")
	if typeId == "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "тип снп не задан")
		return
	}
	hasD2 := c.Query("hasD2")

	dto := &models.GetGroupedSize{TypeId: typeId, HasD2: hasD2 == "true"}
	sizes, err := h.service.Get(c, dto)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось получить размеры")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: sizes})
}

func (h *Handler) create(c *gin.Context) {
	dto := &models.SizeDTO{}
	if err := c.BindJSON(&dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.Create(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось создать размеры")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusCreated, response.IdResponse{Message: "Размеры успешно созданы"})
}

func (h *Handler) createSeveral(c *gin.Context) {
	dto := []*models.SizeDTO{}
	if err := c.BindJSON(&dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.CreateSeveral(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось создать размеры")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusCreated, response.IdResponse{Message: "Размеры успешно созданы"})
}

func (h *Handler) update(c *gin.Context) {
	id := c.Param("id")
	err := uuid.Validate(id)
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "идентификатор не задан")
		return
	}

	dto := &models.SizeDTO{}
	if err := c.BindJSON(&dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}
	dto.Id = id

	if err := h.service.Update(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось обновить размеры")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusOK, response.IdResponse{Message: "размеры успешно обновлены"})
}

func (h *Handler) delete(c *gin.Context) {
	id := c.Param("id")
	err := uuid.Validate(id)
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "идентификатор не задан")
		return
	}

	dto := &models.DeleteSizeDTO{Id: id}
	if err := h.service.Delete(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось удалить размеры")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusOK, response.IdResponse{Message: "размеры успешно удалены"})
}

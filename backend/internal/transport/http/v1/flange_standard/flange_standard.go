package flange_standard

import (
	"net/http"

	"github.com/Alexander272/new-sealur-pro/internal/models"
	"github.com/Alexander272/new-sealur-pro/internal/models/response"
	"github.com/Alexander272/new-sealur-pro/internal/services"
	"github.com/Alexander272/new-sealur-pro/internal/transport/http/middleware"
	"github.com/Alexander272/new-sealur-pro/pkg/error_bot"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type Handler struct {
	services services.FlangeStandard
}

func NewHandler(service services.FlangeStandard) *Handler {
	return &Handler{
		services: service,
	}
}

func Register(api *gin.RouterGroup, service services.FlangeStandard, middleware *middleware.Middleware) {
	handler := NewHandler(service)

	flangeStandard := api.Group("/flange-standards")
	{
		flangeStandard.GET("", handler.getAll)
		flangeStandard.POST("", handler.create)
		flangeStandard.PUT("/:id", handler.update)
		flangeStandard.DELETE("/:id", handler.delete)
	}
}

func (h *Handler) getAll(c *gin.Context) {
	dto := &models.GetFlangeStandardDTO{}

	data, err := h.services.GetAll(c, dto)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось получить стандарты на фланцы")
		error_bot.Send(c, err.Error(), nil)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: data, Total: len(data)})
}

func (h *Handler) create(c *gin.Context) {
	dto := &models.FlangeStandardDTO{}
	if err := c.BindJSON(&dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "wrong data")
		return
	}

	if err := h.services.Create(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось создать стандарт на фланцы")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusCreated, response.IdResponse{Message: "Стандарт на фланец успешно создан"})
}

func (h *Handler) update(c *gin.Context) {
	id := c.Param("id")
	err := uuid.Validate(id)
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "идентификатор не задан")
		return
	}

	dto := &models.FlangeStandardDTO{}
	if err := c.BindJSON(&dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}
	dto.Id = id

	if err := h.services.Update(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось обновить стандарт на фланцы")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusOK, response.IdResponse{Message: "Стандарт на фланец успешно обновлен"})
}

func (h *Handler) delete(c *gin.Context) {
	id := c.Param("id")
	err := uuid.Validate(id)
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "идентификатор не задан")
		return
	}

	dto := &models.DeleteFlangeStandardDTO{Id: id}
	if err := h.services.Delete(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось удалить стандарт на фланцы")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusOK, response.IdResponse{Message: "Стандарт на фланец успешно удален"})
}

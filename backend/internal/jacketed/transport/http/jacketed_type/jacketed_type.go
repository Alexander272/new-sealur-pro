package jacketed_type

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
	service services.JacketedBaseType
}

func NewHandler(service services.JacketedBaseType) *Handler {
	return &Handler{
		service: service,
	}
}

func Register(api *gin.RouterGroup, service services.JacketedBaseType, middleware *middleware.Middleware) {
	handler := NewHandler(service)

	SerratedTypeBase := api.Group("/base")
	{
		SerratedTypeBase.GET("", handler.get)
		write := SerratedTypeBase.Group("", middleware.CheckAccess(constants.AllowAdmin))
		{
			write.POST("", handler.create)
			write.PUT("/:id", handler.update)
			write.DELETE("/:id", handler.delete)
		}
	}
}

func (h *Handler) get(c *gin.Context) {
	data, err := h.service.Get(c, &models.GetTypeBaseDTO{})
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось получить данные")
		error_bot.Send(c, err.Error(), nil)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: data, Total: len(data)})
}

func (h *Handler) create(c *gin.Context) {
	dto := &models.TypeBaseDTO{}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.Create(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось создать тип прокладки")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	logger.Info("Тип прокладки создан", logger.AnyAttr("dto", dto))
	c.JSON(http.StatusCreated, response.IdResponse{Message: "Тип прокладки создан"})
}

func (h *Handler) update(c *gin.Context) {
	id := c.Param("id")
	if err := uuid.Validate(id); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "Идентификатор не задан")
		return
	}

	dto := &models.TypeBaseDTO{}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}
	dto.Id = id

	if err := h.service.Update(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось обновить тип прокладки")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	logger.Info("Тип прокладки обновлен", logger.AnyAttr("dto", dto))
	c.JSON(http.StatusOK, response.IdResponse{Message: "Тип прокладки обновлен"})
}

func (h *Handler) delete(c *gin.Context) {
	id := c.Param("id")
	if err := uuid.Validate(id); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "Идентификатор не задан")
		return
	}

	if err := h.service.Delete(c, &models.DeleteTypeBaseDTO{Id: id}); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось удалить тип прокладки")
		error_bot.Send(c, err.Error(), id)
		return
	}
	logger.Info("Тип прокладки удален", logger.StringAttr("id", id))
	c.JSON(http.StatusOK, response.IdResponse{Message: "Тип прокладки удален"})
}

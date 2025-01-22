package configuration

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
	service services.Configuration
}

func NewHandler(service services.Configuration) *Handler {
	return &Handler{
		service: service,
	}
}

func Register(api *gin.RouterGroup, service services.Configuration, middleware *middleware.Middleware) {
	handler := NewHandler(service)

	configuration := api.Group("/configuration")
	{
		configuration.GET("", handler.get)
		// TODO только для админа
		configuration.POST("", handler.create)
		configuration.PUT("/:id", handler.update)
		configuration.DELETE("/:id", handler.delete)
	}
}

func (h *Handler) get(c *gin.Context) {
	data, err := h.service.Get(c, &models.GetConfigurationDTO{})
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось получить конфигурацию")
		error_bot.Send(c, err.Error(), nil)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: data, Total: len(data)})
}

func (h *Handler) create(c *gin.Context) {
	dto := &models.ConfigurationDTO{}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.Create(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось создать конфигурацию")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	logger.Info("Конфигурация создана", logger.AnyAttr("dto", dto))
	c.JSON(http.StatusCreated, response.IdResponse{Message: "Конфигурация успешно создана"})
}

func (h *Handler) update(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "Идентификатор не задан")
		return
	}

	dto := &models.ConfigurationDTO{}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}
	dto.Id = id

	if err := h.service.Update(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось обновить конфигурацию")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	logger.Info("Конфигурация обновлена", logger.AnyAttr("dto", dto))
	c.JSON(http.StatusOK, response.IdResponse{Message: "Конфигурация успешно обновлена"})
}

func (h *Handler) delete(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "Идентификатор не задан")
		return
	}

	if err := h.service.Delete(c, &models.DeleteConfigurationDTO{Id: id}); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось удалить конфигурацию")
		error_bot.Send(c, err.Error(), id)
		return
	}
	logger.Info("Конфигурация удалена", logger.StringAttr("id", id))
	c.JSON(http.StatusOK, response.IdResponse{Message: "Конфигурация успешно удалена"})
}

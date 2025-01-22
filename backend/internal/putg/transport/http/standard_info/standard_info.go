package standard_info

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
	service services.StandardInfo
}

func NewHandler(service services.StandardInfo) *Handler {
	return &Handler{
		service: service,
	}
}

func Register(api *gin.RouterGroup, service services.StandardInfo, middleware *middleware.Middleware) {
	handler := NewHandler(service)

	standardInfo := api.Group("/standard-info")
	{
		standardInfo.GET("", handler.get)
		// TODO только для админа
		standardInfo.POST("", handler.create)
		standardInfo.PUT("/:id", handler.update)
		standardInfo.DELETE("/:id", handler.delete)
	}
}

func (h *Handler) get(c *gin.Context) {
	data, err := h.service.Get(c, &models.GetStandardInfoDTO{})
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось получить информация о стандарте")
		error_bot.Send(c, err.Error(), nil)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: data, Total: len(data)})
}

func (h *Handler) create(c *gin.Context) {
	dto := &models.StandardInfoDTO{}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.Create(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось создать информация о стандарте")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	logger.Info("Информация о стандарте создана", logger.AnyAttr("dto", dto))
	c.JSON(http.StatusCreated, response.IdResponse{Message: "Информация о стандарте создана"})
}

func (h *Handler) update(c *gin.Context) {
	id := c.Param("id")
	err := uuid.Validate(id)
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "Идентификатор не задан")
		return
	}

	dto := &models.StandardInfoDTO{}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}
	dto.Id = id

	if err := h.service.Update(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось обновить информацию о стандарте")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	logger.Info("Информация о стандарте обновлена", logger.AnyAttr("dto", dto))
	c.JSON(http.StatusOK, response.IdResponse{Message: "Информация о стандарте обновлена"})
}

func (h *Handler) delete(c *gin.Context) {
	id := c.Param("id")
	err := uuid.Validate(id)
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "Идентификатор не задан")
		return
	}

	if err := h.service.Delete(c, &models.DeleteStandardInfoDTO{Id: id}); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось удалить информацию о стандарте")
		error_bot.Send(c, err.Error(), id)
		return
	}
	logger.Info("Информация о стандарте удалена", logger.StringAttr("id", id))
	c.JSON(http.StatusOK, response.IdResponse{Message: "Информация о стандарте удалена"})
}

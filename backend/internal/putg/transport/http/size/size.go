package size

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
	service services.Size
}

func NewHandler(service services.Size) *Handler {
	return &Handler{service: service}
}

func Register(api *gin.RouterGroup, service services.Size, middleware *middleware.Middleware) {
	handler := NewHandler(service)

	size := api.Group("/sizes")
	{
		size.GET("", handler.get)
		// TODO только для админа
		size.POST("", handler.create)
		size.PUT("/:id", handler.update)
		size.DELETE("/:id", handler.delete)
	}
}

func (h *Handler) get(c *gin.Context) {
	flangeType := c.Query("flangeType")
	baseConstruction := c.Query("construction")
	baseFiller := c.Query("filler")
	if flangeType == "" || baseConstruction == "" || baseFiller == "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty params", "Отправлены некорректные данные")
		return
	}

	dto := &models.GetGroupedSizeDTO{
		FlangeTypeId:       flangeType,
		BaseConstructionId: baseConstruction,
		BaseFillerId:       baseFiller,
	}
	data, err := h.service.Get(c, dto)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось получить размеры")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: data, Total: len(data)})
}

func (h *Handler) create(c *gin.Context) {
	dto := &models.SizeDTO{}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.Create(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось создать размер")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	logger.Info("Размер создан", logger.AnyAttr("dto", dto))
	c.JSON(http.StatusCreated, response.IdResponse{Message: "Размер создан"})
}

func (h *Handler) update(c *gin.Context) {
	id := c.Param("id")
	err := uuid.Validate(id)
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "Идентификатор не задан")
		return
	}

	dto := &models.SizeDTO{}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}
	dto.Id = id

	if err := h.service.Update(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось обновить размер")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	logger.Info("Размер обновлен", logger.AnyAttr("dto", dto))
	c.JSON(http.StatusOK, response.IdResponse{Message: "Размер обновлен"})
}

func (h *Handler) delete(c *gin.Context) {
	id := c.Param("id")
	err := uuid.Validate(id)
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "Идентификатор не задан")
		return
	}

	if err := h.service.Delete(c, &models.DeleteSizeDTO{Id: id}); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось удалить размер")
		error_bot.Send(c, err.Error(), id)
		return
	}
	logger.Info("Размер удален", logger.StringAttr("id", id))
	c.JSON(http.StatusOK, response.IdResponse{Message: "Размер удален"})
}

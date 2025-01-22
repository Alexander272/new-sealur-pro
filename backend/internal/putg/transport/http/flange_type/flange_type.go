package flange_type

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
	service services.FlangeType
}

func NewHandler(service services.FlangeType) *Handler {
	return &Handler{service: service}
}

func Register(api *gin.RouterGroup, service services.FlangeType, middleware *middleware.Middleware) {
	handler := NewHandler(service)

	flangeType := api.Group("/flange-types")
	{
		flangeType.GET("", handler.get)
		// TODO только для админа
		flangeType.POST("", handler.create)
		flangeType.PUT("/:id", handler.update)
		flangeType.DELETE("/:id", handler.delete)
	}
}

func (h *Handler) get(c *gin.Context) {
	standard := c.Query("standard")
	if standard == "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty params", "Отправлены некорректные данные")
		return
	}

	dto := &models.GetFlangeTypeDTO{StandardId: standard}
	data, err := h.service.Get(c, dto)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось получить типы фланцев")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: data, Total: len(data)})
}

func (h *Handler) create(c *gin.Context) {
	dto := &models.FlangeTypeDTO{}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.Create(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось создать тип фланца")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	logger.Info("Тип фланца создан", logger.AnyAttr("dto", dto))
	c.JSON(http.StatusCreated, response.IdResponse{Message: "Тип фланца создан"})
}

func (h *Handler) update(c *gin.Context) {
	id := c.Param("id")
	err := uuid.Validate(id)
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "Идентификатор не задан")
		return
	}

	dto := &models.FlangeTypeDTO{}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}
	dto.Id = id

	if err := h.service.Update(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось обновить тип фланца")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	logger.Info("Тип фланца обновлен", logger.AnyAttr("dto", dto))
	c.JSON(http.StatusOK, response.IdResponse{Message: "Тип фланца обновлен"})
}

func (h *Handler) delete(c *gin.Context) {
	id := c.Param("id")
	err := uuid.Validate(id)
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "Идентификатор не задан")
		return
	}

	if err := h.service.Delete(c, &models.DeleteFlangeTypeDTO{Id: id}); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось удалить тип фланца")
		error_bot.Send(c, err.Error(), id)
		return
	}
	logger.Info("Тип фланца удален", logger.StringAttr("id", id))
	c.JSON(http.StatusOK, response.IdResponse{Message: "Тип фланца удален"})
}

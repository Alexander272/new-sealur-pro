package construction

import (
	"net/http"

	"github.com/Alexander272/new-sealur-pro/internal/models/response"
	"github.com/Alexander272/new-sealur-pro/internal/putg/models"
	"github.com/Alexander272/new-sealur-pro/internal/putg/services"
	"github.com/Alexander272/new-sealur-pro/internal/putg/transport/http/construction/base"
	"github.com/Alexander272/new-sealur-pro/internal/transport/http/middleware"
	"github.com/Alexander272/new-sealur-pro/pkg/error_bot"
	"github.com/Alexander272/new-sealur-pro/pkg/logger"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type Handler struct {
	service services.Construction
}

func NewHandler(service services.Construction) *Handler {
	return &Handler{service: service}
}

func Register(api *gin.RouterGroup, services *services.Services, middleware *middleware.Middleware) {
	handler := NewHandler(services.Construction)

	construction := api.Group("/constructions")
	{
		construction.GET("", handler.get)
		// TODO только для админа
		construction.POST("", handler.create)
		construction.PUT("/:id", handler.update)
		construction.DELETE("/:id", handler.delete)
	}
	base.Register(construction, services.BaseConstruction, middleware)
}

func (h *Handler) get(c *gin.Context) {
	filler := c.Query("filler")
	flangeType := c.Query("flangeType")
	if filler == "" || flangeType == "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty params", "Отправлены некорректные данные")
		return
	}

	dto := &models.GetConstructionDTO{}
	data, err := h.service.Get(c, dto)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось получить конструкцию")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: data, Total: len(data)})
}

func (h *Handler) create(c *gin.Context) {
	dto := &models.ConstructionDTO{}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.Create(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось создать конструкцию")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	logger.Info("Конструкция создана", logger.AnyAttr("dto", dto))
	c.JSON(http.StatusCreated, response.IdResponse{Message: "Конструкция создана"})
}

func (h *Handler) update(c *gin.Context) {
	id := c.Param("id")
	err := uuid.Validate(id)
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "Идентификатор не задан")
		return
	}

	dto := &models.ConstructionDTO{}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}
	dto.Id = id

	if err := h.service.Update(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось обновить конструкцию")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	logger.Info("Конструкция обновлена", logger.AnyAttr("dto", dto))
	c.JSON(http.StatusOK, response.IdResponse{Message: "Конструкция обновлена"})
}

func (h *Handler) delete(c *gin.Context) {
	id := c.Param("id")
	err := uuid.Validate(id)
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "Идентификатор не задан")
		return
	}

	if err := h.service.Delete(c, &models.DeleteConstructionDTO{Id: id}); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось удалить конструкцию")
		error_bot.Send(c, err.Error(), id)
		return
	}
	logger.Info("Конструкция удалена", logger.StringAttr("id", id))
	c.JSON(http.StatusOK, response.IdResponse{Message: "Конструкция успешно удалена"})
}

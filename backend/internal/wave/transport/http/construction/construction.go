package construction

import (
	"net/http"

	"github.com/Alexander272/new-sealur-pro/internal/constants"
	"github.com/Alexander272/new-sealur-pro/internal/models/response"
	"github.com/Alexander272/new-sealur-pro/internal/transport/http/middleware"
	"github.com/Alexander272/new-sealur-pro/internal/wave/models"
	"github.com/Alexander272/new-sealur-pro/internal/wave/services"
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

func Register(api *gin.RouterGroup, service services.Construction, middleware *middleware.Middleware) {
	handler := NewHandler(service)

	construction := api.Group("/construction")
	{
		construction.GET("", handler.get)
		write := construction.Group("", middleware.CheckAccess(constants.AllowAdmin))
		{
			write.POST("", handler.create)
			write.PUT("/:id", handler.update)
			write.DELETE("/:id", handler.delete)
		}
	}
}

func (h *Handler) get(c *gin.Context) {
	typeId := c.Query("type")
	if err := uuid.Validate(typeId); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "Идентификатор не задан")
		return
	}

	req := &models.GetConstructionDTO{TypeId: typeId}
	data, err := h.service.Get(c, req)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось получить данные")
		error_bot.Send(c, err.Error(), req)
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
	if err := uuid.Validate(id); err != nil {
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
	if err := uuid.Validate(id); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "Идентификатор не задан")
		return
	}

	if err := h.service.Delete(c, &models.DeleteConstructionDTO{Id: id}); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось удалить конструкцию")
		error_bot.Send(c, err.Error(), id)
		return
	}
	logger.Info("Конструкция удалена", logger.StringAttr("id", id))
	c.JSON(http.StatusOK, response.IdResponse{Message: "Конструкция удалена"})
}

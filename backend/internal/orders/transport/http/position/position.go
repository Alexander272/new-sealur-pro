package position

import (
	"errors"
	"net/http"

	base "github.com/Alexander272/new-sealur-pro/internal/models"
	"github.com/Alexander272/new-sealur-pro/internal/models/response"
	"github.com/Alexander272/new-sealur-pro/internal/orders/models"
	"github.com/Alexander272/new-sealur-pro/internal/orders/services/position"
	"github.com/Alexander272/new-sealur-pro/internal/transport/http/middleware"
	"github.com/Alexander272/new-sealur-pro/pkg/error_bot"
	"github.com/Alexander272/new-sealur-pro/pkg/logger"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type Handler struct {
	service position.Position
}

func NewHandler(service position.Position) *Handler {
	return &Handler{
		service: service,
	}
}

func Register(api *gin.RouterGroup, service position.Position, middleware *middleware.Middleware) {
	handler := NewHandler(service)

	positions := api.Group("/positions")
	{
		positions.GET("", handler.get)
		positions.GET("/:id", handler.getById)
		// positions.GET("/data/:id", handler.getDataById)
		positions.POST("/copy/:id", handler.copy)
		positions.POST("", handler.create)
		positions.PUT("/:id", handler.update)
		positions.DELETE("/:id", handler.delete)
	}
}

func (h *Handler) get(c *gin.Context) {
	order := c.Query("order")
	if order == "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty params", "Отправлены некорректные данные")
		return
	}

	dto := &models.GetPositionsDTO{OrderId: order}
	data, err := h.service.Get(c, dto)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось получить позиции")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: data, Total: len(data)})
}

func (h *Handler) getById(c *gin.Context) {
	id := c.Param("id")
	err := uuid.Validate(id)
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "Идентификатор не задан")
		return
	}

	data, err := h.service.GetById(c, id)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось получить позицию")
		error_bot.Send(c, err.Error(), id)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: data})
}

// func (h *Handler) getDataById(c *gin.Context) {
// 	id := c.Param("id")
// 	err := uuid.Validate(id)
// 	if err != nil {
// 		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "Идентификатор не задан")
// 		return
// 	}

// 	posType := c.Query("type")
// 	if posType == "" {
// 		response.NewErrorResponse(c, http.StatusBadRequest, "empty params", "Отправлены некорректные данные")
// 		return
// 	}

// 	// data, err := h.service.GetDataById(c, id, posType)
// 	// if err != nil {
// 	// 	response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось получить позицию")
// 	// 	error_bot.Send(c, err.Error(), id)
// 	// 	return
// 	// }
// 	// c.JSON(http.StatusOK, response.DataResponse{Data: data})
// }

func (h *Handler) copy(c *gin.Context) {
	id := c.Param("id")
	err := uuid.Validate(id)
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "Идентификатор не задан")
		return
	}

	dto := &models.CopyPositionDTO{}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}
	dto.Id = id

	if err := h.service.Copy(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось скопировать позицию")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	logger.Info("Позиция скопирована", logger.AnyAttr("dto", dto))
	c.JSON(http.StatusOK, response.IdResponse{Message: "Позиция скопирована"})

}

func (h *Handler) create(c *gin.Context) {
	dto := &models.PositionDTO{}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.Create(c, dto); err != nil {
		if errors.Is(err, base.ErrPositionExists) {
			response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Такая позиция уже добавлена")
			return
		}
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось создать позицию")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	logger.Info("Позиция создана", logger.AnyAttr("dto", dto))
	c.JSON(http.StatusCreated, response.IdResponse{Message: "Позиция создана"})
}

func (h *Handler) update(c *gin.Context) {
	id := c.Param("id")
	err := uuid.Validate(id)
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "Идентификатор не задан")
		return
	}

	dto := &models.PositionDTO{}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}
	dto.Id = id

	if err := h.service.Update(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось обновить позицию")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	logger.Info("Позиция обновлена", logger.AnyAttr("dto", dto))
	c.JSON(http.StatusOK, response.IdResponse{Message: "Позиция обновлена"})
}

func (h *Handler) delete(c *gin.Context) {
	id := c.Param("id")
	err := uuid.Validate(id)
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "Идентификатор не задан")
		return
	}
	posType := c.Query("type")
	if posType == "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty params", "Отправлены некорректные данные")
		return
	}

	dto := &models.DeletePositionDTO{Id: id, Type: models.PositionType(posType)}
	if err := h.service.Delete(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось удалить позицию")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	logger.Info("Позиция удалена", logger.StringAttr("id", id), logger.StringAttr("type", posType))
	c.JSON(http.StatusOK, response.IdResponse{Message: "Позиция удалена"})
}

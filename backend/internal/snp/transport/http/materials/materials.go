package materials

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
	service services.Materials
}

func NewHandler(service services.Materials) *Handler {
	return &Handler{
		service: service,
	}
}

func Register(api *gin.RouterGroup, service services.Materials, middleware *middleware.Middleware) {
	handler := NewHandler(service)

	material := api.Group("materials")
	{
		material.GET("", handler.get)
		// TODO только для админа
		material.POST("", handler.create)
		material.PUT("/:id", handler.update)
		material.DELETE("/:id", handler.delete)
	}

}

func (h *Handler) get(c *gin.Context) {
	standardId := c.Query("standardId")
	if standardId == "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "стандарт не задан")
		return
	}

	materials, err := h.service.Get(c, &models.GetMaterialDTO{StandardId: standardId})
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось получить материалы для стандарта")
		error_bot.Send(c, err.Error(), standardId)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: materials})
}

func (h *Handler) create(c *gin.Context) {
	dto := &models.MaterialDTO{}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "отправлены некорректные данные")
		return
	}

	if err := h.service.Create(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось создать материал")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusCreated, response.IdResponse{Message: "Материал успешно создан"})
}

func (h *Handler) update(c *gin.Context) {
	id := c.Param("id")
	err := uuid.Validate(id)
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "empty id param")
		return
	}

	dto := &models.MaterialDTO{}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "отправлены некорректные данные")
		return
	}
	dto.Id = id

	if err := h.service.Update(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось обновить материал")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusOK, response.IdResponse{Message: "Материал успешно обновлен"})
}

func (h *Handler) delete(c *gin.Context) {
	id := c.Param("id")
	err := uuid.Validate(id)
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "empty id param")
		return
	}

	dto := &models.DeleteMaterialDTO{Id: id}
	if err := h.service.Delete(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось удалить материал")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusOK, response.IdResponse{Message: "Материал успешно удален"})
}

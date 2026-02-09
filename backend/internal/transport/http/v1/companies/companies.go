package companies

import (
	"net/http"

	"github.com/Alexander272/new-sealur-pro/internal/models/response"
	"github.com/Alexander272/new-sealur-pro/internal/services"
	"github.com/Alexander272/new-sealur-pro/internal/transport/http/middleware"
	"github.com/Alexander272/new-sealur-pro/pkg/error_bot"
	"github.com/gin-gonic/gin"
)

type Handler struct {
	service services.Company
}

func NewHandler(service services.Company) *Handler {
	return &Handler{
		service: service,
	}
}

func Register(api *gin.RouterGroup, service services.Company, middleware *middleware.Middleware) {
	handler := NewHandler(service)

	companies := api.Group("companies")
	{
		companies.GET(":query", handler.find)
	}
}

func (h *Handler) find(c *gin.Context) {
	query := c.Param("query")
	if query == "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty query", "Query не задан")
		return
	}

	data, err := h.service.FindCompanies(c, query)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка")
		error_bot.Send(c, err.Error(), query)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: data, Total: len(data)})
}

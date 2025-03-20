package http

import (
	"github.com/Alexander272/new-sealur-pro/internal/constants"
	"github.com/Alexander272/new-sealur-pro/internal/mail/services"
	"github.com/Alexander272/new-sealur-pro/internal/mail/transport/http/feedback"
	"github.com/Alexander272/new-sealur-pro/internal/mail/transport/http/order"
	"github.com/Alexander272/new-sealur-pro/internal/mail/transport/http/user"
	"github.com/Alexander272/new-sealur-pro/internal/transport/http/middleware"
	"github.com/gin-gonic/gin"
)

type Handler struct {
	Services *services.Services
}

func NewHandler(services *services.Services) *Handler {
	return &Handler{
		Services: services,
	}
}

func (h *Handler) Init(api *gin.RouterGroup, middleware *middleware.Middleware) {
	emails := api.Group("/emails", middleware.VerifyToken, middleware.CheckAccess(constants.AllowAdmin))
	feedback.Register(emails, h.Services.Feedback, middleware)
	user.Register(emails, h.Services.User, middleware)
	order.Register(emails, h.Services.Order, middleware)
}

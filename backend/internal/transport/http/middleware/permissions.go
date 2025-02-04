package middleware

import (
	"net/http"

	"github.com/Alexander272/new-sealur-pro/internal/constants"
	"github.com/Alexander272/new-sealur-pro/internal/models"
	"github.com/Alexander272/new-sealur-pro/internal/models/response"
	"github.com/gin-gonic/gin"
)

func (m *Middleware) CheckAccess(allowed []string) gin.HandlerFunc {
	return func(c *gin.Context) {
		u, exists := c.Get(constants.CtxUser)
		if !exists {
			response.NewErrorResponse(c, http.StatusUnauthorized, "empty user", "сессия не найдена")
			return
		}

		user := u.(models.User)
		access := false
		for _, a := range allowed {
			if a == user.Role {
				access = true
				break
			}
		}

		if !access {
			response.NewErrorResponse(c, http.StatusForbidden, "access denied", "нет доступа к данному разделу")
			return
		}

		c.Next()
	}
}

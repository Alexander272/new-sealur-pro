package middleware

import (
	"net/http"
	"strings"

	"github.com/Alexander272/new-sealur-pro/internal/constants"
	"github.com/Alexander272/new-sealur-pro/internal/models/response"
	"github.com/gin-gonic/gin"
)

func (m *Middleware) VerifyToken(c *gin.Context) {
	token := strings.Replace(c.GetHeader("Authorization"), "Bearer ", "", 1)

	result, err := m.token.Retrospect(token)
	if err != nil {
		domain := m.auth.Domain
		if !strings.Contains(c.Request.Host, domain) {
			domain = c.Request.Host
		}

		c.SetSameSite(http.SameSiteLaxMode)
		c.SetCookie(constants.AuthPublicCookie, "", -1, "/", domain, m.auth.Secure, true)
		response.NewErrorResponse(c, http.StatusUnauthorized, err.Error(), "сессия не найдена")
		return
	}

	if !result.Active {
		response.NewErrorResponse(c, http.StatusUnauthorized, "token is not active", "время сессии истекло, повторите вход")
		return
	}

	user, err := m.services.Session.DecodeToken(c, result.Claims)
	if err != nil {
		response.NewErrorResponse(c, http.StatusUnauthorized, err.Error(), "токен доступа не валиден")
		return
	}

	c.Set(constants.CtxUser, *user)
	c.Next()
}

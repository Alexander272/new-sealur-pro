package auth

import (
	"fmt"
	"strings"
	"time"

	"github.com/Alexander272/new-sealur-pro/internal/models"
	"github.com/golang-jwt/jwt/v5"
)

type Manager struct {
	key string
}

func NewManager(key string) (*Manager, error) {
	if strings.TrimSpace(key) == "" {
		return nil, models.ErrNotFoundKeys
	}
	return &Manager{key: key}, nil
}

type TokenManager interface {
	Retrospect(token string) (*models.Token, error)
	// NewJWT(userId, email string, roleCode string, company, position string, ttl time.Duration) (time.Time, string, error)
	// Parse(token string) (jwt.MapClaims, error)
	// NewRefreshToken() (string, error)
}

func (m *Manager) Retrospect(token string) (*models.Token, error) {
	key, err := jwt.ParseRSAPublicKeyFromPEM([]byte(m.key))
	if err != nil {
		return nil, err
	}
	res, err := jwt.Parse(token, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodRSA); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
		}

		return key, nil
	})
	if err != nil {
		if strings.Contains(err.Error(), jwt.ErrTokenExpired.Error()) {
			return &models.Token{Active: false}, nil
		}

		return nil, err
	}

	date, err := res.Claims.GetExpirationTime()
	if err != nil {
		return nil, err
	}

	claims := res.Claims.(jwt.MapClaims)
	result := &models.Token{
		Active: date.After(time.Now()),
		Claims: &claims,
	}
	return result, err
}

// func (m *Manager) NewJWT(userId, email string, roleCode string, company, name string, ttl time.Duration) (iat time.Time, token string, err error) {
// 	iat = time.Now()
// 	newToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
// 		// "exp":    iat.Add(ttl).Unix(),
// 		"iat":      iat.Unix(),
// 		"userId":   userId,
// 		"email":    email,
// 		"roleCode": roleCode,
// 		"name":     name,
// 		"company":  company,
// 	})
// 	token, err = newToken.SignedString([]byte(m.jwtKey))
// 	if err != nil {
// 		return iat, token, err
// 	}
// 	return iat, token, nil
// }

// func (m *Manager) Parse(accessToken string) (jwt.MapClaims, error) {
// 	token, err := jwt.Parse(accessToken, func(t *jwt.Token) (interface{}, error) {
// 		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
// 			return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
// 		}
// 		return []byte(m.jwtKey), nil
// 	})

// 	if err != nil {
// 		return nil, err
// 	}

// 	claims, ok := token.Claims.(jwt.MapClaims)
// 	if !ok {
// 		return nil, fmt.Errorf("error get user claims from token")
// 	}
// 	if !token.Valid {
// 		return nil, errors.New("token is invalid")
// 	}

// 	return claims, nil
// }

// func (m *Manager) NewRefreshToken() (string, error) {
// 	b := make([]byte, 32)

// 	s := rand.NewSource(time.Now().Unix())
// 	r := rand.New(s)

// 	if _, err := r.Read(b); err != nil {
// 		return "", err
// 	}

// 	return fmt.Sprintf("%x", b), nil
// }

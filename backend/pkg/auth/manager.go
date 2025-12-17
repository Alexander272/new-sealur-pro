package auth

import (
	"fmt"
	"math/rand"
	"strings"
	"time"

	"github.com/Alexander272/new-sealur-pro/internal/models"
	"github.com/golang-jwt/jwt/v5"
)

type Manager struct {
	publicKey  string
	privateKey string
}

func NewManager(publicKey string, privateKey string) (*Manager, error) {
	if strings.TrimSpace(publicKey) == "" || strings.TrimSpace(privateKey) == "" {
		return nil, models.ErrNotFoundKeys
	}
	return &Manager{publicKey: publicKey, privateKey: privateKey}, nil
}

type TokenManager interface {
	Retrospect(token string) (*models.Token, error)
	NewCode() (string, error)
	// NewJWT(userId, email string, roleCode string, company, position string, ttl time.Duration) (time.Time, string, error)
	// Parse(token string) (jwt.MapClaims, error)
}

func (m *Manager) Retrospect(token string) (*models.Token, error) {
	result, err := m.parseWithKey(token, m.publicKey)
	if err == nil {
		return result, nil
	}
	result, err = m.parseWithKey(token, m.privateKey)
	if err != nil {
		return nil, err
	}

	return result, nil
}

func (m *Manager) parseWithKey(token, key string) (*models.Token, error) {
	usedKey, err := jwt.ParseRSAPublicKeyFromPEM([]byte(key))
	if err != nil {
		return nil, err
	}

	res, err := jwt.Parse(token, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodRSA); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
		}
		return usedKey, nil
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
	return result, nil
}

func GetRealmFromToken(token string) (string, error) {
	claims := &jwt.MapClaims{}
	parsedToken, _ := jwt.ParseWithClaims(token, claims, nil)
	// if err != nil {
	// 	logger.Debug("failed to parse token.", logger.AnyAttr("parsed", parsedToken))
	// 	return "", fmt.Errorf("failed to parse token. error: %w", err)
	// }
	iss, err := parsedToken.Claims.GetIssuer()
	if err != nil {
		return "", fmt.Errorf("failed to get issuer. error: %w", err)
	}
	realm := strings.Split(iss, "realms/")[1]

	return realm, nil
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

func (m *Manager) NewCode() (string, error) {
	b := make([]byte, 32)

	s := rand.NewSource(time.Now().Unix())
	r := rand.New(s)

	if _, err := r.Read(b); err != nil {
		return "", err
	}

	return fmt.Sprintf("%x", b), nil
}

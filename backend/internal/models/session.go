package models

import (
	"time"

	"github.com/goccy/go-json"
	"github.com/golang-jwt/jwt/v5"
)

type SignInDTO struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type SignOutDTO struct {
	UserId       string `json:"userId"`
	Realm        string `json:"realm"`
	RefreshToken string `json:"refreshToken"`
}

type RefreshDTO struct {
	Realm        string `json:"realm"`
	RefreshToken string `json:"refreshToken"`
}

type SignUpDTO struct {
	Company    string `json:"company" binding:"required"`
	Address    string `json:"address"`
	Inn        string `json:"inn"`
	Kpp        string `json:"kpp"`
	Region     string `json:"region"`
	City       string `json:"city"`
	Name       string `json:"name"`
	Position   string `json:"position" binding:"required"`
	Email      string `json:"email" binding:"required,email"`
	Phone      string `json:"phone"`
	Password   string `json:"password" binding:"required,min=6,max=64"`
	ManagerId  string `json:"managerId"`
	UseLink    bool   `json:"useLink"`
	UseLanding bool   `json:"useLanding"`
}

type Token struct {
	Active bool
	Claims *jwt.MapClaims
}

type SessionResponse struct {
	Token  Token  `json:"token"`
	Role   string `json:"role"`
	UserId string `json:"userId"`
}

// type Token struct {
// 	AccessToken string `json:"accessToken"`
// 	Exp         int64  `json:"exp"`
// }

type SignInUserDTO struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6,max=64"`
}

type LimitData struct {
	ClientIP string
	Count    int32
	Exp      time.Duration
}

func (i *LimitData) MarshalBinary() ([]byte, error) {
	return json.Marshal(i)
}

type ConfirmData struct {
	UserId string
	Code   string
	Exp    time.Duration
}

func (i *ConfirmData) MarshalBinary() ([]byte, error) {
	return json.Marshal(i)
}
func (i *ConfirmData) UnMarshalBinary(str string) error {
	return json.Unmarshal([]byte(str), i)
}

type SessionData struct {
	UserId       string
	Name         string
	Company      string
	AccessToken  string
	RefreshToken string
	Role         string
	Exp          time.Duration
}

func (i *SessionData) MarshalBinary() ([]byte, error) {
	return json.Marshal(i)
}

func UnMarshalBinary(str string) *SessionData {
	data := &SessionData{}
	json.Unmarshal([]byte(str), data)
	return data
}

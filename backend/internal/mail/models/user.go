package models

type ConfirmDTO struct {
	Email   string `json:"email" binding:"required,email"`
	Name    string `json:"name" binding:"required"`
	Link    string `json:"link" binding:"required"`
	Support string `json:"support"`
	Subject string `json:"subject"`
}

type RecoveryDTO struct {
	Email   string `json:"email" binding:"required,email"`
	Link    string `json:"link" binding:"required"`
	Support string `json:"support"`
	Subject string `json:"subject"`
}

package models

type FeedbackDTO struct {
	Subject string `json:"subject"`
	Email   string `json:"email" binding:"required,email"`
	Name    string `json:"name" binding:"required"`
	Company string `json:"company"`
	Message string `json:"message" binding:"required"`
}

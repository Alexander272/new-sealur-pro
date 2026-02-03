package models

type Feedback struct {
	Email   string `json:"email" binding:"required,email"`
	Name    string `json:"name" binding:"required"`
	Company string `json:"company"`
	Message string `json:"message" binding:"required"`
	Subject string `json:"subject"`
}

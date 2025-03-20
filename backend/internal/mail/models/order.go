package models

type OrderDTO struct {
	Recipient string `json:"recipient" binding:"required,email"`
	OrderId   string `json:"orderId" binding:"required"`
	Name      string `json:"name" binding:"required"`
	Position  string `json:"position"`
	Company   string `json:"company"`
	Address   string `json:"address"`
	Email     string `json:"email" binding:"required,email"`
	Phone     string `json:"phone"`
	Link      string `json:"link"`
	Subject   string `json:"subject"`
}

type RedirectDTO struct {
	Recipient string `json:"recipient" binding:"required,email"`
	OrderId   string `json:"orderId" binding:"required"`
	Manager   string `json:"manager" binding:"required"`
	Name      string `json:"name" binding:"required"`
	Position  string `json:"position"`
	Company   string `json:"company"`
	Address   string `json:"address"`
	Email     string `json:"email" binding:"required,email"`
	Phone     string `json:"phone"`
	Link      string `json:"link"`
	Subject   string `json:"subject"`
}

package services

import "github.com/Alexander272/new-sealur-pro/internal/analytics/repository"

type Services struct {
	Order
	User
}

func NewServices(repo *repository.Repository) *Services {
	order := NewOrderService(repo.Order)
	user := NewUserService(repo.User)

	return &Services{
		Order: order,
		User:  user,
	}
}

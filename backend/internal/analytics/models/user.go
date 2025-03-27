package models

type UsersStats struct {
	CompanyCount      int `json:"companyCount" db:"company_count"`
	UsersCount        int `json:"usersCount" db:"users_count"`
	NotConfirmedUsers int `json:"notConfirmedUsers" db:"not_confirmed_users"`
	UsersFromManager  int `json:"usersFromManager" db:"users_from_manager"`
}

type GetUsersStatsDTO struct{}

type UsersInfo struct {
	Id          string `json:"id" db:"id"`
	Company     string `json:"company" db:"company"`
	User        string `json:"user" db:"name"`
	Manager     string `json:"manager" db:"manager"`
	FromManager bool   `json:"fromManager" db:"use_link"`
	OrdersCount int    `json:"ordersCount" db:"orders_count"`
	HasOrders   bool   `json:"has_orders" db:"has_orders"`
}

type GetUsersInfoDTO struct {
	Period      *Period
	FromManager *bool
	WithOrders  *bool
	Confirmed   bool
}

// type GetFullUserDataDTO struct {
// 	Id string `json:"id" db:"id"`
// }

// type UserData struct {

// }

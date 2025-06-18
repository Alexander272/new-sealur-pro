package models

import orders "github.com/Alexander272/new-sealur-pro/internal/orders/models"

type Period struct {
	Start string `json:"start"`
	End   string `json:"end"`
}

type GroupedOrdersStats struct {
	Id        string         `json:"id" db:"id"`
	Manager   string         `json:"manager" db:"manager"`
	ManagerId string         `json:"managerId" db:"manager_id"`
	UserId    string         `json:"userId" db:"user_id"`
	User      string         `json:"user" db:"name"`
	Company   string         `json:"company" db:"company"`
	Count     int            `json:"count" db:"count"`
	Position  *PositionStats `json:"positions"`
}

type PositionStats struct {
	Count    int `json:"count" db:"positions_count"`
	Snp      int `json:"snp" db:"snp_count"`
	Putg     int `json:"putg" db:"putg_count"`
	Wave     int `json:"wave" db:"wave_count"`
	Serrated int `json:"serrated" db:"serrated_count"`
	Jacketed int `json:"jacketed" db:"jacketed_count"`
	Rings    int `json:"rings" db:"rings_count"`
	Kit      int `json:"kit" db:"kit_count"`
}

type OrdersStats struct {
	OrdersCount int            `json:"ordersCount"`
	UsersCount  int            `json:"usersCount"`
	Position    *PositionStats `json:"positions"`
}

type GetOrdersStatsDTO struct{}

type GetOrdersCountDTO struct {
	Type orders.PositionType
}

type OrderCount struct {
	UserId    string `json:"userId" db:"user_id"`
	Name      string `json:"name" db:"name"`
	Company   string `json:"company" db:"company"`
	Orders    int    `json:"orders" db:"orders"`
	Positions int    `json:"positions" db:"positions"`
	Average   int    `json:"average" db:"average"`
}

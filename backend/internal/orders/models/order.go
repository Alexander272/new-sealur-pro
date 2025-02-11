package models

type Status string

const (
	StatusNew    Status = "new"
	StatusWork   Status = "work"
	StatusFinish Status = "finish"
)

type Order struct {
	Id            string      `json:"id" db:"id"`
	UserId        string      `json:"userId" db:"user_id"`
	Number        int64       `json:"number" db:"number"`
	Date          string      `json:"date" db:"date"`
	CountPosition int64       `json:"countPosition" db:"count_position"`
	Info          string      `json:"info" db:"info"`
	Positions     []*Position `json:"positions"`
}

type GetOrderDTO struct {
	Id string `json:"id"`
}

type GetCurrentOrderDTO struct {
	UserId    string `json:"userId"`
	ManagerId string `json:"managerId"`
}

type GetAllOrdersDTO struct {
	UserId string `json:"userId"`
}

type GetOrderByNumberDTO struct {
	Number string `json:"number"`
}

type OrderDTO struct {
	Id        string         `json:"id" db:"id"`
	UserId    string         `json:"userId" db:"user_id"`
	ManagerId string         `json:"managerId" db:"manager_id"`
	Count     int64          `json:"count" db:"count_position"`
	Info      string         `json:"info" db:"info"`
	Date      string         `json:"date" db:"date"`
	Positions []*PositionDTO `json:"positions" db:"positions"`
}

type SaveOrderDTO struct {
	Id            string `json:"id" db:"id" binding:"required"`
	CountPosition int64  `json:"count" db:"count_position" binding:"required"`
	Date          string `json:"date" db:"date"`
}

type SetInfoDTO struct {
	OrderId string `json:"orderId" db:"id"`
	Info    string `json:"info" db:"info"`
}
type SetStatusDTO struct {
	Status  Status `json:"status" db:"status"`
	OrderId string `json:"orderId" db:"id"`
	Date    string `json:"date" db:"date"`
}
type SetManagerDTO struct {
	OrderId      string `json:"orderId" db:"id"`
	ManagerId    string `json:"managerId" db:"manager_id"`
	ManagerEmail string `json:"managerEmail"`
	UserId       string `json:"userId"`
	OldManagerId string `json:"oldManagerId"`
}

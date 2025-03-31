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
	Date          int64       `json:"date" db:"date"`
	CountPosition int64       `json:"countPosition" db:"count_position"`
	Info          string      `json:"info" db:"info"`
	Positions     []*Position `json:"positions"`
}

type OrderWithCompany struct {
	Id            string `json:"id" db:"id"`
	Date          int64  `json:"date" db:"date"`
	CountPosition int64  `json:"countPosition" db:"count_position"`
	Number        int64  `json:"number" db:"number"`
	Status        Status `json:"status" db:"status"`
	UserId        string `json:"userId" db:"user_id"`
	User          string `json:"user" db:"user"`
	Manager       string `json:"manager" db:"manager"`
	Company       string `json:"company" db:"company"`
	ManagerId     string `json:"managerId" db:"manager_id"`
	Total         int64  `json:"-" db:"total"`
}

type GetOrderDTO struct {
	Id string `json:"id"`
}

type GetCurrentOrderDTO struct {
	UserId    string `json:"userId"`
	ManagerId string `json:"managerId"`
}

type GetOrdersByUserDTO struct {
	UserId string `json:"userId"`
}

type GetOrderByNumberDTO struct {
	Number string `json:"number"`
}

type GetOrdersByManagerDTO struct {
	ManagerId string `json:"managerId"`
	OnlyOpen  bool   `json:"onlyOpen"`
}

type OrderDTO struct {
	Id        string         `json:"id" db:"id"`
	UserId    string         `json:"userId" db:"user_id"`
	ManagerId string         `json:"managerId" db:"manager_id"`
	Count     int64          `json:"count" db:"count_position"`
	Info      string         `json:"info" db:"info"`
	Date      int64          `json:"date" db:"date"`
	Positions []*PositionDTO `json:"positions" db:"positions"`
}

type SaveOrderDTO struct {
	Id            string `json:"id" db:"id" binding:"required"`
	CountPosition int64  `json:"count" db:"count_position" binding:"required"`
	Date          int64  `json:"date" db:"date"`
	UserId        string
}

type CopyOrderDTO struct {
	Positions []*CopyPositionDTO `json:"positions" binding:"required"`
}

type SetInfoDTO struct {
	OrderId string `json:"orderId" db:"id"`
	Info    string `json:"info" db:"info"`
}
type SetStatusDTO struct {
	Status  Status `json:"status" db:"status"`
	OrderId string `json:"orderId" db:"id"`
	Date    int64  `json:"date" db:"date"`
}
type SetManagerDTO struct {
	OrderId      string `json:"orderId" db:"id"`
	ManagerId    string `json:"managerId" db:"manager_id"`
	ManagerEmail string `json:"managerEmail"`
	UserId       string `json:"userId"`
	OldManagerId string `json:"oldManagerId"`
}

type GetAllOrdersDTO struct {
	Sort    []*Sort   `json:"sort"`
	Filters []*Filter `json:"filters"`
	Limit   int       `json:"limit"`
	Offset  int       `json:"offset"`
}

type Sort struct {
	Field string `json:"field"`
	Type  string `json:"type"`
}

type Filter struct {
	Field       string `json:"field"`
	CompareType string `json:"compareType"`
	Value       string `json:"value"`
}

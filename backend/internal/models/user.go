package models

type User struct {
	Id        string `json:"id"`
	Company   string `json:"company"`
	Address   string `json:"address"`
	Inn       string `json:"inn"`
	Kpp       string `json:"kpp"`
	Region    string `json:"region"`
	City      string `json:"city"`
	Name      string `json:"name"`
	Position  string `json:"position"`
	Email     string `json:"email"`
	Phone     string `json:"phone"`
	RoleCode  string `json:"roleCode"`
	ManagerId string `json:"managerId"`
	UseLink   bool   `json:"useLink"`
}

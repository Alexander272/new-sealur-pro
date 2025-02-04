package models

type User struct {
	Id        string `json:"id" db:"id"`
	Nickname  string `json:"nickname" db:"nickname"`
	Email     string `json:"email" db:"email"`
	Role      string `json:"role" db:"role"`
	Name      string `json:"name" db:"name"`
	Company   string `json:"company" db:"company"`
	Address   string `json:"address" db:"address"`
	Inn       string `json:"inn" db:"inn"`
	Kpp       string `json:"kpp" db:"kpp"`
	Region    string `json:"region" db:"region"`
	City      string `json:"city" db:"city"`
	Position  string `json:"position" db:"position"`
	Phone     string `json:"phone" db:"phone"`
	ManagerId string `json:"managerId" db:"manager_id"`
	UseLink   bool   `json:"useLink" db:"use_link"`
	Password  string `json:"-" db:"password"`
	Confirmed bool   `json:"confirmed" db:"confirmed"`

	Realm        string `json:"realm" db:"realm"`
	ProviderId   string `json:"providerId" db:"provider_id"`
	AccessToken  string `json:"token"`
	RefreshToken string `json:"-"`
}

type GetUsersDTO struct{}

type GetUserByIdDTO struct {
	Id         string `json:"id"`
	ProviderId string `json:"providerId" db:"provider_id"`
}

type GetUserByNickDTO struct {
	// Email    string `json:"email" db:"email"`
	Nickname string `json:"nickname" db:"nickname"`
}

type GetUserByRegionDTO struct {
	Region string `json:"region" db:"region"`
}

type UserDTO struct {
	Id         string `json:"id" db:"id"`
	Nickname   string `json:"nickname" db:"nickname"`
	Role       string `json:"role" db:"role_id"`
	Company    string `json:"company" db:"company"`
	Address    string `json:"address" db:"address"`
	Inn        string `json:"inn" db:"inn"`
	Kpp        string `json:"kpp" db:"kpp"`
	Region     string `json:"region" db:"region"`
	City       string `json:"city" db:"city"`
	Name       string `json:"name" db:"name"`
	Position   string `json:"position" db:"position"`
	Email      string `json:"email" db:"email"`
	Phone      string `json:"phone" db:"phone"`
	Password   string `json:"password" db:"password"`
	Realm      string `json:"realm" db:"realm"`
	ProviderId string `json:"providerId" db:"provider_id"`
	ManagerId  string `json:"managerId" db:"manager_id"`
	UseLink    bool   `json:"useLink" db:"use_link"`
	UseLanding bool   `json:"useLanding" db:"use_landing"`
}

type ConfirmUserDTO struct {
	Id   string `json:"id" db:"id"`
	Data string `json:"data" db:"data"`
}

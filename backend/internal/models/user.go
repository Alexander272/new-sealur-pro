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

type UserInfo struct {
	Id          string `json:"id" db:"id"`
	Nickname    string `json:"nickname" db:"nickname"`
	Email       string `json:"email" db:"email"`
	Role        string `json:"role" db:"role"`
	Name        string `json:"name" db:"name"`
	Company     string `json:"company" db:"company"`
	Address     string `json:"address" db:"address"`
	Inn         string `json:"inn" db:"inn"`
	Kpp         string `json:"kpp" db:"kpp"`
	Region      string `json:"region" db:"region"`
	City        string `json:"city" db:"city"`
	Position    string `json:"position" db:"position"`
	Phone       string `json:"phone" db:"phone"`
	Manager     string `json:"manager" db:"manager"`
	FromManager bool   `json:"fromManager" db:"use_link"`
	FromLanding bool   `json:"fromLanding" db:"use_landing"`
	Confirmed   bool   `json:"confirmed" db:"confirmed"`
	Date        int64  `json:"date" db:"date"`
	OrderDate   int64  `json:"orderDate" db:"order_date"`
	VisitDate   int64  `json:"visitDate" db:"visit_date"`
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

type GetManagersDTO struct{}

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
	Confirmed  bool   `json:"confirmed" db:"confirmed"`
}

type ConfirmUserDTO struct {
	Id   string `json:"id" db:"id"`
	Date int64  `json:"date" db:"date"`
}

type ConfirmDataDTO struct {
	UserId string
	Realm  string
	Kind   string
}

type ChangeManagerDTO struct {
	Id        string `json:"id" db:"id"`
	ManagerId string `json:"managerId" db:"manager_id"`
}

type UserWithManager struct {
	Id       string `json:"id" db:"id"`
	Nickname string `json:"nickname" db:"nickname"`
	Email    string `json:"email" db:"email"`
	// Role         string `json:"role" db:"role"`
	Name         string `json:"name" db:"name"`
	Company      string `json:"company" db:"company"`
	Address      string `json:"address" db:"address"`
	Position     string `json:"position" db:"position"`
	Phone        string `json:"phone" db:"phone"`
	ManagerId    string `json:"managerId" db:"manager_id"`
	Manager      string `json:"manager" db:"manager"`
	ManagerEmail string `json:"managerEmail" db:"manager_email"`
}

type RecoveryDTO struct {
	Email string `json:"email" binding:"required,email"`
	Link  string `json:"link"`
}

type PasswordRecoveryDTO struct {
	Code     string `json:"code"`
	Password string `json:"password" binding:"required,min=6,max=64"`
}

type UpdatePasswordDTO struct {
	UserId   string `json:"userId"`
	Realm    string `json:"realm"`
	Password string `json:"password" binding:"required,min=6,max=64"`
}

package pq_models

type GroupedOrdersStats struct {
	Id        string `db:"id"`
	Manager   string `db:"manager"`
	ManagerId string `db:"manager_id"`
	UserId    string `db:"user_id"`
	User      string `db:"name"`
	Company   string `db:"company"`
	Count     int    `db:"count"`
	PosCount  int    `db:"positions_count"`
	Snp       int    `db:"snp_count"`
	Putg      int    `db:"putg_count"`
	Wave      int    `db:"wave_count"`
	Serrated  int    `db:"serrated_count"`
	Jacketed  int    `db:"jacketed_count"`
	Rings     int    `db:"ring_count"`
	Kit       int    `db:"kit_count"`
}

type OrdersStats struct {
	OrdersCount int `db:"orders_count"`
	UsersCount  int `db:"users_count"`
	PosCount    int `db:"positions_count"`
	Snp         int `db:"snp_count"`
	Putg        int `db:"putg_count"`
	Wave        int `db:"wave_count"`
	Serrated    int `db:"serrated_count"`
	Jacketed    int `db:"jacketed_count"`
	Rings       int `db:"ring_count"`
	Kit         int `db:"kit_count"`
}

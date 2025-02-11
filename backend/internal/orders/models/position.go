package models

type PositionType string

const (
	PositionTypeSnp   PositionType = "Snp"
	PositionTypePutg  PositionType = "Putg"
	PositionTypePutgm PositionType = "Putgm"
	PositionTypeRing  PositionType = "Ring"
	PositionTypeKit   PositionType = "RingsKit"
)

type ShortPosition struct {
	Id      string `json:"id"`
	OrderId string `json:"orderId"`
	Count   int64  `json:"count"`
	Title   string `json:"title"`
	Amount  string `json:"amount"`
	Info    string `json:"info"`
}

type Position struct {
	Id       string        `json:"id" db:"id"`
	OrderId  string        `json:"orderId" db:"order_id"`
	Count    int64         `json:"count" db:"count"`
	Title    string        `json:"title" db:"title"`
	Amount   string        `json:"amount" db:"amount"`
	Type     PositionType  `json:"type" db:"type"`
	Info     string        `json:"info" db:"info"`
	SnpData  *PositionSnp  `json:"snpData"`
	PutgData *PositionPutg `json:"putgData"`
	Data     interface{}   `json:"data"`
	// RingData *PositionRing     `json:"ringData"`
	// KitData  *PositionRingsKit `json:"kitData"`
}

type GetPositionsDTO struct {
	OrderId string `json:"orderId"`
}

type GetPositionByTitle struct {
	Title   string `json:"title"`
	OrderId string `json:"orderId"`
}

type PositionDTO struct {
	Id       string           `json:"id"`
	OrderId  string           `json:"orderId"`
	Count    int64            `json:"count"`
	Title    string           `json:"title"`
	Amount   string           `json:"amount"`
	Type     PositionType     `json:"type"`
	Info     string           `json:"info"`
	SnpData  *PositionSnpDTO  `json:"snpData"`
	PutgData *PositionPutgDTO `json:"putgData"`
	Data     *interface{}     `json:"data"`
	// RingData *PositionRingDTO     `json:"ringData"`
	// KitData  *PositionRingsKitDTO `json:"kitData"`
}

type CopyPositionDTO struct {
	Id          string `json:"id"`
	NewId       string `json:"newId"`
	Amount      string `json:"amount"`
	OrderId     string `json:"orderId"`
	FromOrderId string `json:"fromOrderId"`
	Count       int64  `json:"count"`
}

type DeletePositionDTO struct {
	Id string `json:"id"`
}

package models

import "fmt"

type PositionType string

const (
	PositionTypeSnp      PositionType = "Snp"
	PositionTypePutg     PositionType = "Putg"
	PositionTypeWave     PositionType = "Wave"
	PositionTypeSerrated PositionType = "Serrated"
	PositionTypeJacketed PositionType = "Jacketed"
	PositionTypeRing     PositionType = "Ring"
	PositionTypeKit      PositionType = "RingsKit"
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
	Id           string            `json:"id" db:"id"`
	OrderId      string            `json:"orderId" db:"order_id"`
	Count        int64             `json:"count" db:"count"`
	Title        string            `json:"title" db:"title"`
	Amount       string            `json:"amount" db:"amount"`
	Type         PositionType      `json:"type" db:"type"`
	Info         string            `json:"info" db:"info"`
	SnpData      *PositionSnp      `json:"snpData"`
	PutgData     *PositionPutg     `json:"putgData"`
	WaveData     *PositionWave     `json:"waveData"`
	SerratedData *PositionSerrated `json:"serratedData"`
	JacketedData *PositionJacketed `json:"jacketedData"`
	Data         interface{}       `json:"data"`
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
	Id           string               `json:"id" db:"id"`
	OrderId      string               `json:"orderId" db:"order_id"`
	Count        int64                `json:"count" db:"count"`
	Title        string               `json:"title" db:"title"`
	Amount       string               `json:"amount" db:"amount"`
	Type         PositionType         `json:"type" db:"type"`
	Info         string               `json:"info" db:"info"`
	SnpData      *PositionSnpDTO      `json:"snpData"`
	PutgData     *PositionPutgDTO     `json:"putgData"`
	WaveData     *PositionWaveDTO     `json:"waveData"`
	SerratedData *PositionSerratedDTO `json:"serratedData"`
	JacketedData *PositionJacketedDTO `json:"jacketedData"`
	// RingData *PositionRingDTO     `json:"ringData"`
	// KitData  *PositionRingsKitDTO `json:"kitData"`
}

func (d *PositionDTO) Validate() error {
	switch d.Type {
	case PositionTypeSnp:
		if d.SnpData.Main == nil || d.SnpData.Material == nil || d.SnpData.Size == nil || d.SnpData.Design == nil {
			return fmt.Errorf("the data sent was not correct")
		}
	case PositionTypePutg:
		if d.PutgData.Main == nil || d.PutgData.Material == nil || d.PutgData.Size == nil || d.PutgData.Design == nil {
			return fmt.Errorf("the data sent was not correct")
		}
	case PositionTypeWave:
		if d.WaveData.Main == nil || d.WaveData.Material == nil || d.WaveData.Size == nil || d.WaveData.Design == nil {
			return fmt.Errorf("the data sent was not correct")
		}
	case PositionTypeSerrated:
		if d.SerratedData.Main == nil || d.SerratedData.Material == nil || d.SerratedData.Size == nil || d.SerratedData.Design == nil {
			return fmt.Errorf("the data sent was not correct")
		}
	}

	return nil
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
	Id   string       `json:"id"`
	Type PositionType `json:"type"`
}

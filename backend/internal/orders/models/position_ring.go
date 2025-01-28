package models

// type PositionRing struct{
// 	Id           string                                    `json:"id"`
// 	PositionId   string                                    `json:"positionId"`
// 	RingType     *ring_type_model.RingType                 `json:"ringType"`
// 	Density      *ring_density_model.RingDensity           `json:"density"`
// 	Construction *ring_construction_model.RingConstruction `json:"construction"`
// 	Size         string                                    `json:"size"`
// 	Thickness    string                                    `json:"thickness"`
// 	Material     string                                    `json:"material"`
// 	Modifying    string                                    `json:"modifying"`
// 	Drawing      string                                    `json:"drawing"`
// }

type PositionRingDTO struct {
	Type         *PositionRingDTO_Type         `json:"type"`
	Density      *PositionRingDTO_Density      `json:"density"`
	Construction *PositionRingDTO_Construction `json:"construction"`
	Size         string                        `json:"size"`
	Thickness    string                        `json:"thickness"`
	Material     string                        `json:"material"`
	Modifying    string                        `json:"modifying"`
	Drawing      string                        `json:"drawing"`
}

type PositionRingDTO_Type struct {
	Id   string `json:"id"`
	Code string `json:"code"`
}

type PositionRingDTO_Density struct {
	Id   string `json:"id"`
	Code string `json:"code"`
}

type PositionRingDTO_Construction struct {
	Id       string `json:"id"`
	Code     string `json:"code"`
	WRP      bool   `json:"wrp"`
	BaseCode string `json:"baseCode"`
}

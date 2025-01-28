package models

// type PositionRingsKit struct {
// 	Id           string                                             `json:"id"`
// 	PositionId   string                                             `json:"positionId"`
// 	TypeId       string                                             `json:"typeId"`
// 	Type         string                                             `json:"type"`
// 	Construction *rings_kit_construction_model.RingsKitConstruction `json:"construction"`
// 	Count        string                                             `json:"count"`
// 	Size         string                                             `json:"size"`
// 	Thickness    string                                             `json:"thickness"`
// 	Material     string                                             `json:"material"`
// 	Modifying    string                                             `json:"modifying"`
// 	Drawing      string                                             `json:"drawing"`
// }

type PositionRingsKitDTO struct {
	Type         *PositionRingsKitDTO_Type         `json:"type"`
	Construction *PositionRingsKitDTO_Construction `json:"construction"`
	Count        string                            `json:"count"`
	Size         string                            `json:"size"`
	Thickness    string                            `json:"thickness"`
	Material     string                            `json:"material"`
	Modifying    string                            `json:"modifying"`
	Drawing      string                            `json:"drawing"`
}

type PositionRingsKitDTO_Type struct {
	Id   string `json:"id"`
	Code string `json:"code"`
}

type PositionRingsKitDTO_Construction struct {
	Id   string `json:"id"`
	Code string `json:"code"`
}

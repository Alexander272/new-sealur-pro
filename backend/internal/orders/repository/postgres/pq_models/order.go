package pq_models

import "github.com/Alexander272/new-sealur-pro/internal/orders/models"

type OrderWithPosition struct {
	Id            string              `db:"id"`
	Date          int64               `db:"date"`
	Count         int64               `db:"count_position"`
	Number        int64               `db:"number"`
	PositionId    string              `db:"position_id"`
	Title         string              `db:"title"`
	Amount        string              `db:"amount"`
	PositionCount int64               `db:"position_count"`
	Type          models.PositionType `db:"type"`
	Info          string              `db:"info"`
	Total         int64               `db:"total"`
}

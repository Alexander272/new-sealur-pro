package postgres

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/analytics/models"
	"github.com/Alexander272/new-sealur-pro/internal/analytics/repository/postgres/pq_models"
	orders "github.com/Alexander272/new-sealur-pro/internal/orders/models"
	"github.com/jmoiron/sqlx"
)

type OrderRepo struct {
	db *sqlx.DB
}

func NewOrderRepo(db *sqlx.DB) *OrderRepo {
	return &OrderRepo{
		db: db,
	}
}

type Order interface {
	GetOrdersStats(ctx context.Context, req *models.GetOrdersStatsDTO) (*models.OrdersStats, error)
	GetGroupedOrdersStats(ctx context.Context, req *models.Period) ([]*models.GroupedOrdersStats, error)
	GetOrdersCount(ctx context.Context, req *models.GetOrdersCountDTO) ([]*models.OrderCount, error)
}

func (r *OrderRepo) GetOrdersStats(ctx context.Context, req *models.GetOrdersStatsDTO) (*models.OrdersStats, error) {
	query := fmt.Sprintf(`SELECT count(DISTINCT o.id) as orders_count, COUNT(DISTINCT user_id) as users_count, 
		SUM(amount::integer) as positions_count, 
		COALESCE(SUM(CASE WHEN type = '%s' THEN amount::integer END), 0) AS snp_count,
		COALESCE(SUM(CASE WHEN type = '%s' THEN amount::integer END), 0) AS putg_count,
		COALESCE(SUM(CASE WHEN type = '%s' THEN amount::integer END), 0) AS wave_count,
		COALESCE(SUM(CASE WHEN type = '%s' THEN amount::integer END), 0) AS ring_count,
		COALESCE(SUM(CASE WHEN type = '%s' THEN amount::integer END), 0) AS kit_count
		FROM "%s" as o
		INNER JOIN "%s" AS p ON order_id=o.id WHERE date != ''`,
		orders.PositionTypeSnp, orders.PositionTypePutg, orders.PositionTypeWave, orders.PositionTypeRing, orders.PositionTypeKit,
		OrderTable, PositionTable,
	)
	tmp := &pq_models.OrdersStats{}

	if err := r.db.GetContext(ctx, tmp, query); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}

	data := &models.OrdersStats{
		OrdersCount: tmp.OrdersCount,
		UsersCount:  tmp.UsersCount,
		Position: &models.PositionStats{
			Count: tmp.PosCount,
			Snp:   tmp.Snp,
			Putg:  tmp.Putg,
			Wave:  tmp.Wave,
			Rings: tmp.Rings,
			Kit:   tmp.Kit,
		},
	}
	return data, nil
}

func (r *OrderRepo) GetGroupedOrdersStats(ctx context.Context, req *models.Period) ([]*models.GroupedOrdersStats, error) {
	condition := ""
	params := []interface{}{}
	if req != nil && req.Start != "" {
		condition = "AND date BETWEEN $1 AND $2"
		params = append(params, req.Start, req.End)
	}

	query := fmt.Sprintf(`SELECT o.user_id, name, company, manager, manager_id,
		COUNT(DISTINCT number) AS count, SUM(amount::integer) AS positions_count,
		COALESCE(SUM(CASE WHEN type = '%s' THEN amount::integer END), 0) AS snp_count,
		COALESCE(SUM(CASE WHEN type = '%s' THEN amount::integer END), 0) AS putg_count,
		COALESCE(SUM(CASE WHEN type = '%s' THEN amount::integer END), 0) AS wave_count,
		COALESCE(SUM(CASE WHEN type = '%s' THEN amount::integer END), 0) AS ring_count,
		COALESCE(SUM(CASE WHEN type = '%s' THEN amount::integer END), 0) AS kit_count
		FROM "%s" AS o
		INNER JOIN "%s" AS p ON order_id=o.id
		LEFT JOIN LATERAL (SELECT name, company FROM "%s" WHERE id=o.user_id) AS u ON true
		LEFT JOIN LATERAL (SELECT name AS manager FROM "%s" WHERE id=o.manager_id) AS m ON true
		WHERE date!='' %s
		GROUP BY user_id, manager_id, name, company, manager
		ORDER BY company, name`,
		orders.PositionTypeSnp, orders.PositionTypePutg, orders.PositionTypeWave, orders.PositionTypeRing, orders.PositionTypeKit,
		OrderTable, PositionTable, UserTable, UserTable,
		condition,
	)
	tmp := []*pq_models.GroupedOrdersStats{}

	if err := r.db.SelectContext(ctx, &tmp, query, params...); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}

	data := []*models.GroupedOrdersStats{}
	for _, d := range tmp {
		data = append(data, &models.GroupedOrdersStats{
			// Id:        d.UserId,
			Manager:   d.Manager,
			ManagerId: d.ManagerId,
			UserId:    d.UserId,
			User:      d.User,
			Company:   d.Company,
			Count:     d.Count,
			Position: &models.PositionStats{
				Count: d.PosCount,
				Snp:   d.Snp,
				Putg:  d.Putg,
				Wave:  d.Wave,
				Rings: d.Rings,
				Kit:   d.Kit,
			},
		})
	}
	return data, nil
}

func (r *OrderRepo) GetOrdersCount(ctx context.Context, req *models.GetOrdersCountDTO) ([]*models.OrderCount, error) {
	params := []interface{}{"%"}
	if req.Type != "" {
		params = []interface{}{req.Type}
	}

	query := fmt.Sprintf(`SELECT user_id, company, name,
		COUNT(DISTINCT CASE WHEN type LIKE $1 THEN o.id END) AS orders,
		COALESCE(SUM(CASE WHEN type LIKE $1 THEN amount::integer END),0) AS positions,
		COALESCE((SUM(CASE WHEN type LIKE $1 THEN amount::integer END)/
			COUNT(DISTINCT CASE WHEN type LIKE $1 THEN o.id END))::real,0) AS average
		FROM "%s" AS o
		INNER JOIN LATERAL (SELECT amount, type FROM "%s" WHERE order_id=o.id) AS p ON true
		INNER JOIN LATERAL (SELECT name, company FROM "%s" WHERE id=o.user_id) AS u ON true
		WHERE o.date != '' GROUP BY user_id, company, name 
		HAVING COUNT(DISTINCT CASE WHEN type LIKE $1 THEN o.id END)>0
		ORDER BY company DESC`,
		OrderTable, PositionTable, UserTable,
	)
	data := []*models.OrderCount{}

	if err := r.db.SelectContext(ctx, &data, query, params...); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

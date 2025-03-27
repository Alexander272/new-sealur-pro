package postgres

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/analytics/models"
	"github.com/jmoiron/sqlx"
)

type UserRepo struct {
	db *sqlx.DB
}

func NewUserRepo(db *sqlx.DB) *UserRepo {
	return &UserRepo{
		db: db,
	}
}

type User interface {
	GetUsersStats(ctx context.Context, req *models.Period) (*models.UsersStats, error)
	GetUsersInfo(ctx context.Context, req *models.GetUsersInfoDTO) ([]*models.UsersInfo, error)
}

func (r *UserRepo) GetUsersStats(ctx context.Context, req *models.Period) (*models.UsersStats, error) {
	condition := ""
	params := []interface{}{}
	if req != nil && req.Start != "" {
		condition = "WHERE date BETWEEN $1 AND $2"
		params = append(params, req.Start, req.End)
	}

	query := fmt.Sprintf(`SELECT COUNT(DISTINCT CASE WHEN is_inner=false AND confirmed=true THEN inn END) AS company_count,
		COUNT(CASE WHEN is_inner=false AND confirmed=true THEN is_inner END) AS users_count, 
		COUNT(CASE WHEN is_inner=false AND confirmed=false THEN is_inner END) AS not_confirmed_users, 
		COUNT(CASE WHEN use_link=true AND is_inner=false AND confirmed=true THEN use_link END) AS users_from_manager 
		FROM "%s" %s`,
		UserTable, condition,
	)
	data := &models.UsersStats{}

	if err := r.db.GetContext(ctx, data, query, params...); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *UserRepo) GetUsersInfo(ctx context.Context, req *models.GetUsersInfoDTO) ([]*models.UsersInfo, error) {
	condition := ""
	params := []interface{}{req.Confirmed}
	if req.Period != nil && req.Period.Start != "" {
		condition = fmt.Sprintf(" AND date BETWEEN $%d AND $%d", len(params)+1, len(params)+2)
		params = append(params, req.Period.Start, req.Period.End)
	}
	if req.FromManager != nil {
		condition += fmt.Sprintf(" AND use_link=$%d", len(params)+1)
		params = append(params, *req.FromManager)
	}
	if req.WithOrders != nil {
		condition += " AND orders_count>0"
	}

	query := fmt.Sprintf(`SELECT id, company, name, manager, use_link, orders_count, (orders_count>0) AS has_orders
		FROM "%s" AS u
		INNER JOIN LATERAL (SELECT name AS manager FROM "%s" WHERE id=u.manager_id) AS m ON true
		INNER JOIN LATERAL (SELECT COUNT(id) AS orders_count FROM "%s" WHERE date!='' AND user_id=u.id) AS o ON true
		WHERE is_inner=false AND confirmed=$1%s
		ORDER BY company`,
		UserTable, UserTable, OrderTable, condition,
	)
	data := []*models.UsersInfo{}

	if err := r.db.SelectContext(ctx, &data, query, params...); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

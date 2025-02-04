package postgres

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/models"
	"github.com/jmoiron/sqlx"
)

type RoleRepo struct {
	db *sqlx.DB
}

func NewRoleRepo(db *sqlx.DB) *RoleRepo {
	return &RoleRepo{db: db}
}

type Role interface {
	Get(ctx context.Context, req *models.GetRolesDTO) ([]*models.Role, error)
	GetDefault(ctx context.Context) (*models.Role, error)
}

func (r *RoleRepo) Get(ctx context.Context, req *models.GetRolesDTO) ([]*models.Role, error) {
	query := fmt.Sprintf(`SELECT id, title, code, level FROM %s ORDER BY level`, RoleTable)
	data := []*models.Role{}

	if err := r.db.SelectContext(ctx, &data, query); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *RoleRepo) GetDefault(ctx context.Context) (*models.Role, error) {
	query := fmt.Sprintf(`SELECT id, title, code FROM %s WHERE is_default=true LIMIT 1`, RoleTable)
	data := &models.Role{}

	if err := r.db.GetContext(ctx, data, query); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

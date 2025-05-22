package postgres

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/serrated/models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type SerratedTypeBaseRepo struct {
	db *sqlx.DB
}

func NewSerratedTypeBaseRepo(db *sqlx.DB) *SerratedTypeBaseRepo {
	return &SerratedTypeBaseRepo{
		db: db,
	}
}

type SerratedTypeBase interface {
	Get(ctx context.Context, req *models.GetSerratedTypeBaseDTO) ([]*models.SerratedTypeBase, error)
	Create(ctx context.Context, dto *models.SerratedTypeBaseDTO) error
	Update(ctx context.Context, dto *models.SerratedTypeBaseDTO) error
	Delete(ctx context.Context, dto *models.DeleteSerratedTypeBaseDTO) error
}

func (r *SerratedTypeBaseRepo) Get(ctx context.Context, req *models.GetSerratedTypeBaseDTO) ([]*models.SerratedTypeBase, error) {
	query := fmt.Sprintf(`SELECT id, title, code, description, has_d4, has_d3, has_d2, has_d1 FROM %s`, TypeBaseTable)

	data := []*models.SerratedTypeBase{}
	if err := r.db.SelectContext(ctx, &data, query); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *SerratedTypeBaseRepo) Create(ctx context.Context, dto *models.SerratedTypeBaseDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s (id, title, code, description, has_d4, has_d3, has_d2, has_d1) 
		VALUES (:id, :title, :code, :description, :has_d4, :has_d3, :has_d2, :has_d1)`,
		TypeBaseTable,
	)
	dto.Id = uuid.NewString()

	if _, err := r.db.NamedExecContext(ctx, query, dto); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *SerratedTypeBaseRepo) Update(ctx context.Context, dto *models.SerratedTypeBaseDTO) error {
	query := fmt.Sprintf(`UPDATE %s SET title=:title, code=:code, description=:description, 
		has_d4=:has_d4, has_d3=:has_d3, has_d2=:has_d2, has_d1=:has_d1 WHERE id=:id`,
		TypeBaseTable,
	)

	if _, err := r.db.NamedExecContext(ctx, query, dto); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *SerratedTypeBaseRepo) Delete(ctx context.Context, dto *models.DeleteSerratedTypeBaseDTO) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE id=:id`, TypeBaseTable)

	if _, err := r.db.NamedExecContext(ctx, query, dto); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

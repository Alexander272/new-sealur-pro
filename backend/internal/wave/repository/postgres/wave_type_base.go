package postgres

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/wave/models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type WaveTypeBaseRepo struct {
	db *sqlx.DB
}

func NewWaveTypeBaseRepo(db *sqlx.DB) *WaveTypeBaseRepo {
	return &WaveTypeBaseRepo{
		db: db,
	}
}

type WaveTypeBase interface {
	Get(ctx context.Context, req *models.GetWaveTypeBaseDTO) ([]*models.WaveTypeBase, error)
	Create(ctx context.Context, dto *models.WaveTypeBaseDTO) error
	Update(ctx context.Context, dto *models.WaveTypeBaseDTO) error
	Delete(ctx context.Context, dto *models.DeleteWaveTypeBaseDTO) error
}

func (r *WaveTypeBaseRepo) Get(ctx context.Context, req *models.GetWaveTypeBaseDTO) ([]*models.WaveTypeBase, error) {
	query := fmt.Sprintf(`SELECT id, title, code, description, has_d4, has_d3, has_d2, has_d1 FROM %s`, WaveTypeBaseTable)

	data := []*models.WaveTypeBase{}
	if err := r.db.SelectContext(ctx, &data, query); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *WaveTypeBaseRepo) Create(ctx context.Context, dto *models.WaveTypeBaseDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s (id, title, code, description, has_d4, has_d3, has_d2, has_d1) 
		VALUES (:id, :title, :code, :description, :has_d4, :has_d3, :has_d2, :has_d1)`,
		WaveTypeBaseTable,
	)
	dto.Id = uuid.NewString()

	_, err := r.db.NamedExecContext(ctx, query, dto)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *WaveTypeBaseRepo) Update(ctx context.Context, dto *models.WaveTypeBaseDTO) error {
	query := fmt.Sprintf(`UPDATE %s SET title=:title, code=:code, description=:description, 
		has_d4=:has_d4, has_d3=:has_d3, has_d2=:has_d2, has_d1=:has_d1 WHERE id=:id`,
		WaveTypeBaseTable,
	)

	_, err := r.db.NamedExecContext(ctx, query, dto)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *WaveTypeBaseRepo) Delete(ctx context.Context, dto *models.DeleteWaveTypeBaseDTO) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE id=:id`, WaveTypeBaseTable)

	_, err := r.db.NamedExecContext(ctx, query, dto)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

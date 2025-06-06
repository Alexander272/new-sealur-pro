package postgres

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/jacketed/models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type FillerRepo struct {
	db *sqlx.DB
}

func NewFillerRepo(db *sqlx.DB) *FillerRepo {
	return &FillerRepo{db: db}
}

type Filler interface {
	Get(ctx context.Context, req *models.GetFillerDTO) ([]*models.Filler, error)
	Create(ctx context.Context, dto *models.FillerDTO) error
	Update(ctx context.Context, dto *models.FillerDTO) error
	Delete(ctx context.Context, dto *models.DeleteFillerDTO) error
}

func (r *FillerRepo) Get(ctx context.Context, req *models.GetFillerDTO) ([]*models.Filler, error) {
	query := fmt.Sprintf(`SELECT f.id, t.title as temperature, f.title, code, description, designation FROM %s AS f 
		INNER JOIN %s AS t ON temperature_id=t.id 
		ORDER BY code`,
		FillerTable, TemperatureTable,
	)

	data := []*models.Filler{}
	if err := r.db.SelectContext(ctx, &data, query); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *FillerRepo) Create(ctx context.Context, dto *models.FillerDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s (id, temperature_id, title, code, description, designation) 
		VALUES (:id, :temperature_id, :title, :code, :description, :designation)`,
		FillerTable,
	)
	dto.Id = uuid.NewString()

	if _, err := r.db.NamedExecContext(ctx, query, dto); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *FillerRepo) Update(ctx context.Context, dto *models.FillerDTO) error {
	query := fmt.Sprintf(`UPDATE %s SET temperature_id=:temperature_id, title=:title, code=:code, 
		description=:description, designation=:designation WHERE id=:id`,
		FillerTable,
	)

	if _, err := r.db.NamedExecContext(ctx, query, dto); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *FillerRepo) Delete(ctx context.Context, dto *models.DeleteFillerDTO) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE id=:id`, FillerTable)

	if _, err := r.db.NamedExecContext(ctx, query, dto); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

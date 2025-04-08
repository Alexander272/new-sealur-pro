package postgres

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/wave/models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type PlatingRepo struct {
	db *sqlx.DB
}

func NewPlatingRepo(db *sqlx.DB) *PlatingRepo {
	return &PlatingRepo{db: db}
}

type Plating interface {
	Get(ctx context.Context, req *models.GetPlatingDTO) ([]*models.Plating, error)
	Create(ctx context.Context, dto *models.PlatingDTO) error
	Update(ctx context.Context, dto *models.PlatingDTO) error
	Delete(ctx context.Context, dto *models.DeletePlatingDTO) error
}

func (r *PlatingRepo) Get(ctx context.Context, req *models.GetPlatingDTO) ([]*models.Plating, error) {
	query := fmt.Sprintf(`SELECT f.id, t.title as temperature, f.title, code, description, designation
		FROM %s AS f INNER JOIN %s AS t ON temperature_id=t.id ORDER BY code`,
		PlatingTable, TemperatureTable,
	)

	data := []*models.Plating{}
	if err := r.db.SelectContext(ctx, &data, query); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *PlatingRepo) Create(ctx context.Context, dto *models.PlatingDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s (id, temperature_id, title, code, description, designation) 
		VALUES (:id, :temperature_id, :title, :code, :description, :designation)`,
		PlatingTable,
	)
	dto.Id = uuid.NewString()

	if _, err := r.db.NamedExecContext(ctx, query, dto); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *PlatingRepo) Update(ctx context.Context, dto *models.PlatingDTO) error {
	query := fmt.Sprintf(`UPDATE %s SET temperature_id=:temperature_id, title=:title, code=:code, 
		description=:description, designation=:designation WHERE id=:id`,
		PlatingTable,
	)

	if _, err := r.db.NamedExecContext(ctx, query, dto); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *PlatingRepo) Delete(ctx context.Context, dto *models.DeletePlatingDTO) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE id=:id`, PlatingTable)

	if _, err := r.db.NamedExecContext(ctx, query, dto); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

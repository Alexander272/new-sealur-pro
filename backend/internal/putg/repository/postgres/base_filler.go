package postgres

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/putg/models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type BaseFillerRepo struct {
	db *sqlx.DB
}

func NewBaseFillerRepo(db *sqlx.DB) *BaseFillerRepo {
	return &BaseFillerRepo{db: db}
}

type BaseFiller interface {
	Get(ctx context.Context, req *models.GetBaseFillerDTO) ([]*models.BaseFiller, error)
	Create(ctx context.Context, dto *models.BaseFillerDTO) error
	Update(ctx context.Context, dto *models.BaseFillerDTO) error
	Delete(ctx context.Context, dto *models.DeleteBaseFillerDTO) error
}

func (r *BaseFillerRepo) Get(ctx context.Context, req *models.GetBaseFillerDTO) ([]*models.BaseFiller, error) {
	query := fmt.Sprintf(`SELECT f.id, t.title as temperature, f.title, description, designation
	 	FROM %s AS f INNER JOIN %s AS t ON temperature_id=t.id ORDER BY code`,
		PutgFillerBaseTable, TemperatureTable,
	)
	data := []*models.BaseFiller{}

	if err := r.db.SelectContext(ctx, &data, query); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *BaseFillerRepo) Create(ctx context.Context, dto *models.BaseFillerDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s (id, temperature_id, title, description, designation, code)
		VALUES ($1, $2, $3, $4, $5, $6)`, PutgFillerBaseTable,
	)
	dto.Id = uuid.NewString()

	_, err := r.db.ExecContext(ctx, query, dto.Id, dto.TemperatureId, dto.Title, dto.Description, dto.Designation, dto.Code)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *BaseFillerRepo) Update(ctx context.Context, dto *models.BaseFillerDTO) error {
	query := fmt.Sprintf(`UPDATE %s SET temperature_id=$1, title=$2, description=$3, designation=$4, code=$5 WHERE id=$6`, PutgFillerBaseTable)

	_, err := r.db.ExecContext(ctx, query, dto.TemperatureId, dto.Title, dto.Description, dto.Designation, dto.Code, dto.Id)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *BaseFillerRepo) Delete(ctx context.Context, dto *models.DeleteBaseFillerDTO) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE id=$1`, PutgFillerBaseTable)

	_, err := r.db.ExecContext(ctx, query, dto.Id)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

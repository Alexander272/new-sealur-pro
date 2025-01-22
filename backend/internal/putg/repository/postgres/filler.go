package postgres

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/putg/models"
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
	query := fmt.Sprintf(`SELECT f.id, base_filler_id as base_id, t.title as temperature, bf.title, description, designation
		FROM %s AS f
		INNER JOIN %s AS bf ON base_filler_id=bf.id 
		INNER JOIN %s AS t ON temperature_id=t.id 
		WHERE putg_standard_id=$1 ORDER BY code`,
		PutgFillerTable, PutgFillerBaseTable, TemperatureTable,
	)
	data := []*models.Filler{}

	if err := r.db.SelectContext(ctx, &data, query, req.StandardId); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *FillerRepo) Create(ctx context.Context, dto *models.FillerDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, base_filler_id, putg_standard_id) VALUES ($1, $2, $3)`, PutgFillerTable)
	dto.Id = uuid.NewString()

	_, err := r.db.ExecContext(ctx, query, dto.Id, dto.FillerId, dto.StandardId)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *FillerRepo) Update(ctx context.Context, dto *models.FillerDTO) error {
	query := fmt.Sprintf(`UPDATE %s SET base_filler_id=$1, putg_standard_id=$2 WHERE id=$3`, PutgFillerTable)

	_, err := r.db.ExecContext(ctx, query, dto.FillerId, dto.StandardId, dto.Id)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *FillerRepo) Delete(ctx context.Context, dto *models.DeleteFillerDTO) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE id=$1`, PutgFillerTable)

	_, err := r.db.ExecContext(ctx, query, dto.Id)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

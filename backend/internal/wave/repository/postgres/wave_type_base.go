package postgres

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/wave/models"
	"github.com/Alexander272/new-sealur-pro/internal/wave/repository/postgres/pq_models"
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
	query := fmt.Sprintf(`SELECT id, title, code, description, has_d4, has_d3, has_d2, has_d1, width_range FROM %s`, WaveTypeBaseTable)

	tmp := []*pq_models.WaveType{}
	if err := r.db.SelectContext(ctx, &tmp, query); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}

	data := make([]*models.WaveTypeBase, 0, len(tmp))
	for _, v := range tmp {
		data = append(data, &models.WaveTypeBase{
			Id:          v.Id,
			Title:       v.Title,
			Code:        v.Code,
			Description: v.Description,
			HasD4:       v.HasD4,
			HasD3:       v.HasD3,
			HasD2:       v.HasD2,
			HasD1:       v.HasD1,
			WidthRange:  v.WidthRange,
		})
	}
	return data, nil
}

func (r *WaveTypeBaseRepo) Create(ctx context.Context, dto *models.WaveTypeBaseDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s (id, title, code, description, has_d4, has_d3, has_d2, has_d1, width_range) 
		VALUES (:id, :title, :code, :description, :has_d4, :has_d3, :has_d2, :has_d1, :width_range)`,
		WaveTypeBaseTable,
	)
	dto.Id = uuid.NewString()

	tmp := pq_models.WaveTypeBaseDTO{
		Id:          dto.Id,
		Title:       dto.Title,
		Code:        dto.Code,
		Description: dto.Description,
		HasD4:       dto.HasD4,
		HasD3:       dto.HasD3,
		HasD2:       dto.HasD2,
		HasD1:       dto.HasD1,
		WidthRange:  dto.WidthRange,
	}

	if _, err := r.db.NamedExecContext(ctx, query, tmp); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *WaveTypeBaseRepo) Update(ctx context.Context, dto *models.WaveTypeBaseDTO) error {
	query := fmt.Sprintf(`UPDATE %s SET title=:title, code=:code, description=:description, 
		has_d4=:has_d4, has_d3=:has_d3, has_d2=:has_d2, has_d1=:has_d1 WHERE id=:id`,
		WaveTypeBaseTable,
	)

	tmp := pq_models.WaveTypeBaseDTO{
		Id:          dto.Id,
		Title:       dto.Title,
		Code:        dto.Code,
		Description: dto.Description,
		HasD4:       dto.HasD4,
		HasD3:       dto.HasD3,
		HasD2:       dto.HasD2,
		HasD1:       dto.HasD1,
		WidthRange:  dto.WidthRange,
	}

	if _, err := r.db.NamedExecContext(ctx, query, tmp); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *WaveTypeBaseRepo) Delete(ctx context.Context, dto *models.DeleteWaveTypeBaseDTO) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE id=:id`, WaveTypeBaseTable)

	if _, err := r.db.NamedExecContext(ctx, query, dto); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

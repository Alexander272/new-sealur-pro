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
	query := fmt.Sprintf(`SELECT id, title, code, description, dn_range FROM %s`, WaveTypeBaseTable)

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
			DnRange:     v.DnRange,
		})
	}
	return data, nil
}

func (r *WaveTypeBaseRepo) Create(ctx context.Context, dto *models.WaveTypeBaseDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s (id, title, code, description, priority, dn_range) 
		VALUES (:id, :title, :code, :description, :priority, :dn_range)`,
		WaveTypeBaseTable,
	)
	dto.Id = uuid.NewString()

	tmp := pq_models.WaveTypeDTO{
		Id:          dto.Id,
		Title:       dto.Title,
		Code:        dto.Code,
		Description: dto.Description,
		Priority:    dto.Priority,
		DnRange:     dto.DnRange,
	}

	_, err := r.db.NamedExecContext(ctx, query, tmp)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *WaveTypeBaseRepo) Update(ctx context.Context, dto *models.WaveTypeBaseDTO) error {
	query := fmt.Sprintf(`UPDATE %s SET title=:title, code=:code, description=:description, priority=:priority, 
		dn_range=:dn_range WHERE id=:id`,
		WaveTypeBaseTable,
	)

	tmp := pq_models.WaveTypeDTO{
		Id:          dto.Id,
		Title:       dto.Title,
		Code:        dto.Code,
		Description: dto.Description,
		Priority:    dto.Priority,
		DnRange:     dto.DnRange,
	}

	_, err := r.db.NamedExecContext(ctx, query, tmp)
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

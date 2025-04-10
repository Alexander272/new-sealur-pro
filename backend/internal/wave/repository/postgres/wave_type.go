package postgres

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/wave/models"
	"github.com/Alexander272/new-sealur-pro/internal/wave/repository/postgres/pq_models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type TypeRepo struct {
	db *sqlx.DB
}

func NewTypeRepo(db *sqlx.DB) *TypeRepo {
	return &TypeRepo{
		db: db,
	}
}

type WaveType interface {
	Get(ctx context.Context, req *models.GetWaveTypesDTO) ([]*models.WaveType, error)
	Create(ctx context.Context, dto *models.WaveTypeDTO) error
	Update(ctx context.Context, dto *models.WaveTypeDTO) error
	Delete(ctx context.Context, dto *models.DeleteWaveTypeDTO) error
}

func (r *TypeRepo) Get(ctx context.Context, req *models.GetWaveTypesDTO) ([]*models.WaveType, error) {
	query := fmt.Sprintf(`SELECT t.id, b.id AS base_id, title, code, description, priority, dn_range, width_range, has_d4, has_d3, has_d2, has_d1
		FROM %s AS t LEFT JOIN %s AS b ON t.base_id = b.id
		WHERE flange_id=$1 ORDER BY priority, dn_range`,
		WaveTypeTable, WaveTypeBaseTable,
	)
	tmp := []*pq_models.WaveType{}

	if err := r.db.SelectContext(ctx, &tmp, query, req.FlangeId); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}

	data := make([]*models.WaveType, 0, len(tmp))
	for _, v := range tmp {
		data = append(data, &models.WaveType{
			Id:          v.Id,
			FlangeId:    v.FlangeId,
			BaseId:      v.BaseId,
			Title:       v.Title,
			Code:        v.Code,
			Description: v.Description,
			Priority:    v.Priority,
			DnRange:     v.DnRange,
			WidthRange:  v.WidthRange,
			HasD4:       v.HasD4,
			HasD3:       v.HasD3,
			HasD2:       v.HasD2,
			HasD1:       v.HasD1,
		})
	}
	return data, nil
}

func (r *TypeRepo) Create(ctx context.Context, dto *models.WaveTypeDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s (id, flange_id, base_id, priority, dn_range) 
		VALUES (:id, :flange_id, :base_id, :priority, :dn_range)`,
		WaveTypeTable,
	)
	dto.Id = uuid.NewString()

	tmp := pq_models.WaveTypeDTO{
		Id:       dto.Id,
		FlangeId: dto.FlangeId,
		BaseId:   dto.BaseId,
		Priority: dto.Priority,
		DnRange:  dto.DnRange,
	}

	_, err := r.db.NamedExecContext(ctx, query, tmp)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *TypeRepo) Update(ctx context.Context, dto *models.WaveTypeDTO) error {
	query := fmt.Sprintf(`UPDATE %s SET flange_id=:flange_id, base_id=:base_id, priority=:priority WHERE id=:id`,
		WaveTypeTable,
	)

	tmp := pq_models.WaveTypeDTO{
		Id:       dto.Id,
		FlangeId: dto.FlangeId,
		BaseId:   dto.BaseId,
		Priority: dto.Priority,
		DnRange:  dto.DnRange,
	}

	_, err := r.db.NamedExecContext(ctx, query, tmp)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *TypeRepo) Delete(ctx context.Context, dto *models.DeleteWaveTypeDTO) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE id=$1`, WaveTypeTable)

	_, err := r.db.ExecContext(ctx, query, dto.Id)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

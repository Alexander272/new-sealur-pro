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
	query := fmt.Sprintf(`SELECT t.id, b.id AS base_id, title, code, description, priority, dn_range FROM %s AS t LEFT JOIN %s AS b ON t.base_id = b.id
		WHERE standard_id=$1 ORDER BY priority`,
		WaveTypeTable, WaveTypeBaseTable,
	)
	tmp := []*pq_models.WaveType{}

	if err := r.db.SelectContext(ctx, &tmp, query, req.StandardId); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}

	data := make([]*models.WaveType, 0, len(tmp))
	for _, v := range tmp {
		data = append(data, &models.WaveType{
			Id:          v.Id,
			StandardId:  v.StandardId,
			BaseId:      v.BaseId,
			Title:       v.Title,
			Code:        v.Code,
			Description: v.Description,
			Priority:    v.Priority,
			DnRange:     v.DnRange,
		})
	}
	return data, nil
}

func (r *TypeRepo) Create(ctx context.Context, dto *models.WaveTypeDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s (id, standard_id, base_id, priority) VALUES (:id, :standard_id, :base_id, :priority)`,
		WaveTypeTable,
	)
	dto.Id = uuid.NewString()

	_, err := r.db.NamedExecContext(ctx, query, dto)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *TypeRepo) Update(ctx context.Context, dto *models.WaveTypeDTO) error {
	query := fmt.Sprintf(`UPDATE %s SET standard_id=:standard_id, base_id=:base_id, priority=:priority WHERE id=:id`,
		WaveTypeTable,
	)

	_, err := r.db.NamedExecContext(ctx, query, dto)
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

package postgres

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/putg/models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type FlangeTypeRepo struct {
	db *sqlx.DB
}

func NewFlangeTypeRepo(db *sqlx.DB) *FlangeTypeRepo {
	return &FlangeTypeRepo{db: db}
}

type FlangeType interface {
	Get(ctx context.Context, req *models.GetFlangeTypeDTO) ([]*models.FlangeType, error)
	Create(ctx context.Context, dto *models.FlangeTypeDTO) error
	Update(ctx context.Context, dto *models.FlangeTypeDTO) error
	Delete(ctx context.Context, dto *models.DeleteFlangeTypeDTO) error
}

func (r *FlangeTypeRepo) Get(ctx context.Context, req *models.GetFlangeTypeDTO) ([]*models.FlangeType, error) {
	query := fmt.Sprintf(`SELECT id, title, code FROM %s WHERE putg_standard_id=$1 ORDER BY code`, PutgFlangeTypeTable)
	data := []*models.FlangeType{}

	if err := r.db.SelectContext(ctx, &data, query, req.StandardId); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *FlangeTypeRepo) Create(ctx context.Context, dto *models.FlangeTypeDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s (id, title, code, putg_standard_id) VALUES ($1, $2, $3, $4)`, PutgFlangeTypeTable)
	dto.Id = uuid.NewString()

	_, err := r.db.ExecContext(ctx, query, dto.Id, dto.Title, dto.Code, dto.StandardId)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *FlangeTypeRepo) Update(ctx context.Context, dto *models.FlangeTypeDTO) error {
	query := fmt.Sprintf(`UPDATE %s SET title=$1, code=$2, putg_standard_id=$3 WHERE id=$4`, PutgFlangeTypeTable)

	_, err := r.db.ExecContext(ctx, query, dto.Title, dto.Code, dto.StandardId, dto.Id)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *FlangeTypeRepo) Delete(ctx context.Context, dto *models.DeleteFlangeTypeDTO) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE id=$1`, PutgFlangeTypeTable)

	_, err := r.db.ExecContext(ctx, query, dto.Id)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

package postgres

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/putg/models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type BaseConstructionRepo struct {
	db *sqlx.DB
}

func NewBaseConstructionRepo(db *sqlx.DB) *BaseConstructionRepo {
	return &BaseConstructionRepo{db: db}
}

type BaseConstruction interface {
	Get(ctx context.Context, req *models.GetBaseConstructionDTO) ([]*models.Construction, error)
	Create(ctx context.Context, dto *models.BaseConstructionDTO) error
	Update(ctx context.Context, dto *models.BaseConstructionDTO) error
	Delete(ctx context.Context, dto *models.DeleteBaseConstructionDTO) error
}

func (r *BaseConstructionRepo) Get(ctx context.Context, req *models.GetBaseConstructionDTO) ([]*models.Construction, error) {
	query := fmt.Sprintf(`SELECT id, title, code, description, has_d4, has_d3, has_d2, has_d1, 
		has_rotary_plug, has_inner_ring, has_outer_ring FROM %s ORDER BY code`,
		PutgConstructionTable,
	)
	data := []*models.Construction{}

	if err := r.db.SelectContext(ctx, &data, query); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *BaseConstructionRepo) Create(ctx context.Context, dto *models.BaseConstructionDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, title, code, description, has_d4, has_d3, has_d2, has_d1, 
		has_rotary_plug, has_inner_ring, has_outer_ring)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
		PutgConstructionTable,
	)
	dto.Id = uuid.NewString()

	_, err := r.db.ExecContext(ctx, query, dto.Id, dto.Title, dto.Code, dto.Description, dto.HasD4, dto.HasD3, dto.HasD2, dto.HasD1,
		dto.HasRotaryPlug, dto.HasInnerRing, dto.HasOuterRing,
	)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *BaseConstructionRepo) Update(ctx context.Context, dto *models.BaseConstructionDTO) error {
	query := fmt.Sprintf(`UPDATE %s SET title=$1, code=$2, has_d4=$3, has_d3=$4, has_d2=$5, has_d1=$6, has_rotary=$7, has_inner_ring=$8,
		has_outer_ring=$9, description=$10 WHERE id=$11`,
		PutgConstructionTable,
	)

	_, err := r.db.ExecContext(ctx, query, dto.Title, dto.Code, dto.HasD4, dto.HasD3, dto.HasD2, dto.HasD1,
		dto.HasRotaryPlug, dto.HasInnerRing, dto.HasOuterRing, dto.Description,
	)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *BaseConstructionRepo) Delete(ctx context.Context, dto *models.DeleteBaseConstructionDTO) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE id=$1`, PutgConstructionTable)

	_, err := r.db.ExecContext(ctx, query, dto.Id)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

package postgres

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/wave/models"
	"github.com/Alexander272/new-sealur-pro/internal/wave/repository/postgres/pq_models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type BaseConstructionRepo struct {
	db *sqlx.DB
}

func NewBaseConstructionRepo(db *sqlx.DB) *BaseConstructionRepo {
	return &BaseConstructionRepo{
		db: db,
	}
}

type BaseConstruction interface {
	Get(ctx context.Context, req *models.GetBaseConstructionDTO) ([]*models.Construction, error)
	Create(ctx context.Context, dto *models.BaseConstructionDTO) error
	Update(ctx context.Context, dto *models.BaseConstructionDTO) error
	Delete(ctx context.Context, dto *models.DeleteBaseConstructionDTO) error
}

func (r *BaseConstructionRepo) Get(ctx context.Context, req *models.GetBaseConstructionDTO) ([]*models.Construction, error) {
	query := fmt.Sprintf(`SELECT id, title, code, description, has_material FROM %s WHERE $1::text=ANY(allowed_types) ORDER BY code`, BaseConstructionTable)

	data := []*models.Construction{}
	if err := r.db.SelectContext(ctx, &data, query, req.TypeId); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *BaseConstructionRepo) Create(ctx context.Context, dto *models.BaseConstructionDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s (id, title, code, description, allowed_types, has_material) 
		VALUES (:id, :title, :code, :description, :allowed_types, :has_material)`,
		BaseConstructionTable,
	)
	dto.Id = uuid.NewString()

	tmp := pq_models.ConstructionDTO{
		Id:           dto.Id,
		Title:        dto.Title,
		Code:         dto.Code,
		Description:  dto.Description,
		AllowedTypes: dto.AllowedTypes,
		HasMaterial:  dto.HasMaterial,
	}

	_, err := r.db.NamedExecContext(ctx, query, tmp)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *BaseConstructionRepo) Update(ctx context.Context, dto *models.BaseConstructionDTO) error {
	query := fmt.Sprintf(`UPDATE %s SET title=:title, code=:code, description=:description, allowed_types=:allowed_types, 
		has_material=:has_material WHERE id=:id`,
		BaseConstructionTable,
	)

	tmp := pq_models.ConstructionDTO{
		Id:           dto.Id,
		Title:        dto.Title,
		Code:         dto.Code,
		Description:  dto.Description,
		AllowedTypes: dto.AllowedTypes,
		HasMaterial:  dto.HasMaterial,
	}

	_, err := r.db.NamedExecContext(ctx, query, tmp)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *BaseConstructionRepo) Delete(ctx context.Context, dto *models.DeleteBaseConstructionDTO) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE id=:id`, BaseConstructionTable)

	_, err := r.db.NamedExecContext(ctx, query, dto)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

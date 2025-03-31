package postgres

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/wave/models"
	"github.com/Alexander272/new-sealur-pro/internal/wave/repository/postgres/pq_models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type ConstructionRepo struct {
	db *sqlx.DB
}

func NewConstructionRepo(db *sqlx.DB) *ConstructionRepo {
	return &ConstructionRepo{
		db: db,
	}
}

type Construction interface {
	Get(ctx context.Context, req *models.GetConstructionDTO) ([]*models.Construction, error)
	Create(ctx context.Context, dto *models.ConstructionDTO) error
	Update(ctx context.Context, dto *models.ConstructionDTO) error
	Delete(ctx context.Context, dto *models.DeleteConstructionDTO) error
}

func (r *ConstructionRepo) Get(ctx context.Context, req *models.GetConstructionDTO) ([]*models.Construction, error) {
	query := fmt.Sprintf(`SELECT id, title, code, description FROM %s WHERE $1::text=ANY(allowed_types)`, WaveConstructionTable)

	data := []*models.Construction{}
	if err := r.db.SelectContext(ctx, &data, query, req.TypeId); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *ConstructionRepo) Create(ctx context.Context, dto *models.ConstructionDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s (id, title, code, description, allowed_types) VALUES (:id, :title, :code, :description, :allowed_types)`,
		WaveConstructionTable,
	)
	dto.Id = uuid.NewString()

	tmp := pq_models.ConstructionDTO{
		Id:           dto.Id,
		Title:        dto.Title,
		Code:         dto.Code,
		Description:  dto.Description,
		AllowedTypes: dto.AllowedTypes,
	}

	_, err := r.db.NamedExecContext(ctx, query, tmp)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *ConstructionRepo) Update(ctx context.Context, dto *models.ConstructionDTO) error {
	query := fmt.Sprintf(`UPDATE %s SET title=:title, code=:code, description=:description, allowed_types=:allowed_types WHERE id=:id`,
		WaveConstructionTable,
	)

	tmp := pq_models.ConstructionDTO{
		Id:           dto.Id,
		Title:        dto.Title,
		Code:         dto.Code,
		Description:  dto.Description,
		AllowedTypes: dto.AllowedTypes,
	}

	_, err := r.db.NamedExecContext(ctx, query, tmp)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *ConstructionRepo) Delete(ctx context.Context, dto *models.DeleteConstructionDTO) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE id=:id`, WaveConstructionTable)

	_, err := r.db.NamedExecContext(ctx, query, dto)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

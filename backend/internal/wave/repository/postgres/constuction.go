package postgres

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/wave/models"
	"github.com/jmoiron/sqlx"
)

type ConstructionRepo struct {
	db sqlx.DB
}

func NewConstructionRepo(db *sqlx.DB) *ConstructionRepo {
	return &ConstructionRepo{
		db: *db,
	}
}

type Construction interface {
	Get(ctx context.Context, req *models.GetConstructionDTO) ([]*models.Construction, error)
	Create(ctx context.Context, dto *models.ConstructionDTO) error
	Update(ctx context.Context, dto *models.ConstructionDTO) error
	Delete(ctx context.Context, dto *models.DeleteConstructionDTO) error
}

func (r *ConstructionRepo) Get(ctx context.Context, req *models.GetConstructionDTO) ([]*models.Construction, error) {
	query := fmt.Sprintf(`SELECT b.id, title, code, description, has_material
		FROM %s AS b LEFT JOIN %s AS c ON b.id=base_id
		LEFT JOIN LATERAL (SELECT COUNT(*) AS total FROM %s WHERE standard_id=$1) AS t ON true
		WHERE $2::text=ANY(allowed_types) AND CASE WHEN total>0 THEN standard_id=$1 ELSE true END
		ORDER BY code`,
		BaseConstructionTable, ConstructionsTable, ConstructionsTable,
	)

	data := []*models.Construction{}
	if err := r.db.SelectContext(ctx, &data, query, req.StandardId, req.TypeId); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *ConstructionRepo) Create(ctx context.Context, dto *models.ConstructionDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s (id, base_id, standard_id) VALUES (:id, :base_id, :standard_id)`, ConstructionsTable)

	if _, err := r.db.NamedExecContext(ctx, query, dto); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *ConstructionRepo) Update(ctx context.Context, dto *models.ConstructionDTO) error {
	query := fmt.Sprintf(`UPDATE %s SET base_id=:base_id, standard_id=:standard_id WHERE id=:id`, ConstructionsTable)

	if _, err := r.db.NamedExecContext(ctx, query, dto); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *ConstructionRepo) Delete(ctx context.Context, dto *models.DeleteConstructionDTO) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE id=:id`, ConstructionsTable)

	if _, err := r.db.NamedExecContext(ctx, query, dto); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

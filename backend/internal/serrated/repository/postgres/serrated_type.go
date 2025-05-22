package postgres

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/serrated/models"
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

type SerratedType interface {
	Get(ctx context.Context, req *models.GetSerratedTypesDTO) ([]*models.SerratedType, error)
	Create(ctx context.Context, dto *models.SerratedTypeDTO) error
	Update(ctx context.Context, dto *models.SerratedTypeDTO) error
	Delete(ctx context.Context, dto *models.DeleteSerratedTypeDTO) error
}

func (r *TypeRepo) Get(ctx context.Context, req *models.GetSerratedTypesDTO) ([]*models.SerratedType, error) {
	query := fmt.Sprintf(`SELECT t.id, flange_id, b.id AS base_id, title, code, description, has_d4, has_d3, has_d2, has_d1
		FROM %s AS t LEFT JOIN %s AS b ON t.base_id = b.id
		WHERE flange_id=$1 ORDER BY code`,
		TypeTable, TypeBaseTable,
	)
	data := []*models.SerratedType{}

	if err := r.db.SelectContext(ctx, &data, query, req.FlangeId); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *TypeRepo) Create(ctx context.Context, dto *models.SerratedTypeDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s (id, flange_id, base_id) VALUES (:id, :flange_id, :base_id)`,
		TypeTable,
	)
	dto.Id = uuid.NewString()

	_, err := r.db.NamedExecContext(ctx, query, dto)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *TypeRepo) Update(ctx context.Context, dto *models.SerratedTypeDTO) error {
	query := fmt.Sprintf(`UPDATE %s SET flange_id=:flange_id, base_id=:base_id WHERE id=:id`,
		TypeTable,
	)

	_, err := r.db.NamedExecContext(ctx, query, dto)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *TypeRepo) Delete(ctx context.Context, dto *models.DeleteSerratedTypeDTO) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE id=$1`, TypeTable)

	_, err := r.db.ExecContext(ctx, query, dto.Id)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

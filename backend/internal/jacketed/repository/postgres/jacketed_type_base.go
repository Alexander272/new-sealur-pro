package postgres

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/jacketed/models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type JacketedTypeBaseRepo struct {
	db *sqlx.DB
}

func NewJacketedTypeBaseRepo(db *sqlx.DB) *JacketedTypeBaseRepo {
	return &JacketedTypeBaseRepo{
		db: db,
	}
}

type JacketedBaseType interface {
	Get(ctx context.Context, req *models.GetTypeBaseDTO) ([]*models.TypeBase, error)
	Create(ctx context.Context, dto *models.TypeBaseDTO) error
	Update(ctx context.Context, dto *models.TypeBaseDTO) error
	Delete(ctx context.Context, dto *models.DeleteTypeBaseDTO) error
}

func (r *JacketedTypeBaseRepo) Get(ctx context.Context, req *models.GetTypeBaseDTO) ([]*models.TypeBase, error) {
	query := fmt.Sprintf(`SELECT id, title, code, description, has_d4, has_d3, has_d2, has_d1 FROM %s`, TypeBaseTable)

	data := []*models.TypeBase{}
	if err := r.db.SelectContext(ctx, &data, query); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *JacketedTypeBaseRepo) Create(ctx context.Context, dto *models.TypeBaseDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s (id, title, code, description, has_d4, has_d3, has_d2, has_d1) 
		VALUES (:id, :title, :code, :description, :has_d4, :has_d3, :has_d2, :has_d1)`,
		TypeBaseTable,
	)
	dto.Id = uuid.NewString()

	if _, err := r.db.NamedExecContext(ctx, query, dto); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *JacketedTypeBaseRepo) Update(ctx context.Context, dto *models.TypeBaseDTO) error {
	query := fmt.Sprintf(`UPDATE %s SET title=:title, code=:code, description=:description, 
		has_d4=:has_d4, has_d3=:has_d3, has_d2=:has_d2, has_d1=:has_d1 WHERE id=:id`,
		TypeBaseTable,
	)

	if _, err := r.db.NamedExecContext(ctx, query, dto); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *JacketedTypeBaseRepo) Delete(ctx context.Context, dto *models.DeleteTypeBaseDTO) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE id=:id`, TypeBaseTable)

	if _, err := r.db.NamedExecContext(ctx, query, dto); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

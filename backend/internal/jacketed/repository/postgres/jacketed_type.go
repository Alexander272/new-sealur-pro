package postgres

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/jacketed/models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type JacketedTypeRepo struct {
	db *sqlx.DB
}

func NewJacketedTypeRepo(db *sqlx.DB) *JacketedTypeRepo {
	return &JacketedTypeRepo{
		db: db,
	}
}

type JacketedType interface {
	Get(ctx context.Context, req *models.GetJacketedTypeDTO) ([]*models.JacketedType, error)
	Create(ctx context.Context, dto *models.JacketedTypeDTO) error
	Update(ctx context.Context, dto *models.JacketedTypeDTO) error
	Delete(ctx context.Context, dto *models.DeleteJacketedTypeDTO) error
}

func (r *JacketedTypeRepo) Get(ctx context.Context, req *models.GetJacketedTypeDTO) ([]*models.JacketedType, error) {
	query := fmt.Sprintf(`SELECT id, title, code, description, has_d4, has_d3, has_d2, has_d1 FROM %s WHERE filler_id=$1`, TypeTable)

	data := []*models.JacketedType{}
	if err := r.db.SelectContext(ctx, &data, query, req.FillerId); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *JacketedTypeRepo) Create(ctx context.Context, dto *models.JacketedTypeDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s (id, filler_id, title, code, description, has_d4, has_d3, has_d2, has_d1) 
		VALUES (:id, :filler_id, :title, :code, :description, :has_d4, :has_d3, :has_d2, :has_d1)`,
		TypeTable,
	)
	dto.Id = uuid.NewString()

	if _, err := r.db.NamedExecContext(ctx, query, dto); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *JacketedTypeRepo) Update(ctx context.Context, dto *models.JacketedTypeDTO) error {
	query := fmt.Sprintf(`UPDATE %s SET title=:title, code=:code, description=:description, 
		has_d4=:has_d4, has_d3=:has_d3, has_d2=:has_d2, has_d1=:has_d1 WHERE id=:id`,
		TypeTable,
	)

	if _, err := r.db.NamedExecContext(ctx, query, dto); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *JacketedTypeRepo) Delete(ctx context.Context, dto *models.DeleteJacketedTypeDTO) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE id=:id`, TypeTable)

	if _, err := r.db.NamedExecContext(ctx, query, dto); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

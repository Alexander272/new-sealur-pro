package postgres

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/wave/models"
	"github.com/jmoiron/sqlx"
)

type InfoRepo struct {
	db *sqlx.DB
}

func NewInfoRepo(db *sqlx.DB) *InfoRepo {
	return &InfoRepo{
		db: db,
	}
}

type Info interface {
	Get(ctx context.Context, req *models.GetInfoDTO) (*models.Info, error)
	Create(ctx context.Context, dto *models.InfoDTO) error
	Update(ctx context.Context, dto *models.InfoDTO) error
	Delete(ctx context.Context, dto *models.DeleteInfoDTO) error
}

func (r *InfoRepo) Get(ctx context.Context, req *models.GetInfoDTO) (*models.Info, error) {
	query := fmt.Sprintf(`SELECT id, standard_id, has_jumper, has_hole, has_coating, with_retainer FROM %s WHERE standard_id=$1`,
		InfoTable,
	)
	data := &models.Info{}

	if err := r.db.GetContext(ctx, data, query, req.StandardId); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *InfoRepo) Create(ctx context.Context, dto *models.InfoDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s (id, standard_id, has_jumper, has_hole, has_coating, with_retainer) 
		VALUES (:id, :standard_id, :has_jumper, :has_hole, :has_coating, :with_retainer)`,
		InfoTable,
	)

	if _, err := r.db.NamedExecContext(ctx, query, dto); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *InfoRepo) Update(ctx context.Context, dto *models.InfoDTO) error {
	query := fmt.Sprintf(`UPDATE %s SET has_jumper=:has_jumper, has_hole=:has_hole, has_coating=:has_coating, 
		with_retainer=:with_retainer WHERE id=:id`,
		InfoTable,
	)

	if _, err := r.db.NamedExecContext(ctx, query, dto); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *InfoRepo) Delete(ctx context.Context, dto *models.DeleteInfoDTO) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE id=:id`, InfoTable)

	if _, err := r.db.NamedExecContext(ctx, query, dto); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

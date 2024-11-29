package postgres

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	base "github.com/Alexander272/new-sealur-pro/internal/models"
	"github.com/Alexander272/new-sealur-pro/internal/snp/models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type InfoRepo struct {
	db *sqlx.DB
}

func NewInfoRepo(db *sqlx.DB) *InfoRepo {
	return &InfoRepo{db: db}
}

type Info interface {
	GetByType(ctx context.Context, req *models.GetInfoDTO) (*models.Info, error)
	Create(ctx context.Context, dto *models.InfoDTO) error
	Update(ctx context.Context, dto *models.InfoDTO) error
	Delete(ctx context.Context, dto *models.DeleteInfoDTO) error
}

func (r *InfoRepo) GetByType(ctx context.Context, req *models.GetInfoDTO) (*models.Info, error) {
	query := fmt.Sprintf(`SELECT id, has_inner_ring, has_frame, has_outer_ring, has_hole, has_jumper, has_mounting FROM %s 
		WHERE type_id=$1 LIMIT 1`,
		InfoTable,
	)
	data := &models.Info{}

	if err := r.db.GetContext(ctx, data, query, req.TypeId); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, base.ErrNotFound
		}
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *InfoRepo) Create(ctx context.Context, dto *models.InfoDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, type_id, standard_id, has_inner_ring, has_frame, has_outer_ring, has_hole, has_jumper, has_mounting)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
		InfoTable,
	)
	id := uuid.New()

	_, err := r.db.ExecContext(ctx, query, id, dto.TypeId, dto.StandardId, dto.HasInnerRing, dto.HasFrame, dto.HasOuterRing,
		dto.HasHole, dto.HasJumper, dto.HasMounting,
	)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *InfoRepo) Update(ctx context.Context, dto *models.InfoDTO) error {
	query := fmt.Sprintf(`UPDATE %s	SET type_id=$1, standard_id=$2, has_inner_ring=$3, has_frame=$4, has_outer_ring=$5, 
		has_hole=$6, has_jumper=$7, has_mounting=$8 WHERE id=$9`, InfoTable)

	_, err := r.db.ExecContext(ctx, query, dto.TypeId, dto.StandardId, dto.HasInnerRing, dto.HasFrame, dto.HasOuterRing,
		dto.HasHole, dto.HasJumper, dto.HasMounting, dto.Id,
	)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *InfoRepo) Delete(ctx context.Context, dto *models.DeleteInfoDTO) error {
	query := fmt.Sprintf("DELETE FROM %s WHERE id=$1", InfoTable)

	if _, err := r.db.ExecContext(ctx, query, dto.Id); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

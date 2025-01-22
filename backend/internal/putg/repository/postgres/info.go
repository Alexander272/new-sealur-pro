package postgres

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/putg/models"
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
	GetByFiller(ctx context.Context, req *models.GetInfoByFillerDTO) (*models.Info, error)
	GetByConstruction(ctx context.Context, req *models.GetInfoByConstructionDTO) ([]*models.Info, error)
	Create(ctx context.Context, dto *models.InfoDTO) error
	Update(ctx context.Context, dto *models.InfoDTO) error
	Delete(ctx context.Context, dto *models.DeleteInfoDTO) error
}

func (r *InfoRepo) GetByFiller(ctx context.Context, req *models.GetInfoByFillerDTO) (*models.Info, error) {
	query := fmt.Sprintf(`SELECT id, filler_id, has_jumper, has_hole, has_removable, has_mounting, has_coating FROM %s WHERE filler_id=$1`,
		PutgDataTable,
	)
	data := &models.Info{}

	if err := r.db.GetContext(ctx, data, query, req.FillerId); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *InfoRepo) GetByConstruction(ctx context.Context, req *models.GetInfoByConstructionDTO) ([]*models.Info, error) {
	query := fmt.Sprintf(`SELECT i.id, filler_id, has_jumper, has_hole, has_removable, has_mounting, has_coating FROM %s AS i
		INNER JOIN %s AS f ON filler_id=f.id WHERE construction_id=$1 ORDER BY code`,
		PutgDataTable, PutgFillerTable,
	)
	data := []*models.Info{}

	if err := r.db.SelectContext(ctx, &data, query, req.ConstructionId); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *InfoRepo) Create(ctx context.Context, dto *models.InfoDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s (id, filler_id, has_jumper, has_hole, has_removable, has_mounting, has_coating)
		VALUES ($1, $2, $3, $4, $5, $6, $7)`,
		PutgDataTable,
	)
	dto.Id = uuid.NewString()

	_, err := r.db.ExecContext(ctx, query, dto.Id, dto.FillerId, dto.HasJumper, dto.HasHole, dto.HasRemovable, dto.HasMounting, dto.HasCoating)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *InfoRepo) Update(ctx context.Context, dto *models.InfoDTO) error {
	query := fmt.Sprintf(`UPDATE %s SET filler_id=$1, has_jumper=$2, has_hole=$3, has_removable=$4, has_mounting=$5, has_coating=$6 
		WHERE id=$7`,
		PutgDataTable,
	)

	_, err := r.db.ExecContext(ctx, query, dto.FillerId, dto.HasJumper, dto.HasHole, dto.HasRemovable, dto.HasMounting, dto.HasCoating, dto.Id)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *InfoRepo) Delete(ctx context.Context, dto *models.DeleteInfoDTO) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE id=$1`, PutgDataTable)

	_, err := r.db.ExecContext(ctx, query, dto.Id)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

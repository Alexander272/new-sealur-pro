package postgres

import (
	"context"
	"fmt"

	base "github.com/Alexander272/new-sealur-pro/internal/models"
	"github.com/Alexander272/new-sealur-pro/internal/putg/models"
	"github.com/Alexander272/new-sealur-pro/internal/putg/repository/postgres/pg_models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type StandardInfoRepo struct {
	db *sqlx.DB
}

func NewStandardInfoRepo(db *sqlx.DB) *StandardInfoRepo {
	return &StandardInfoRepo{
		db: db,
	}
}

type StandardInfo interface {
	Get(ctx context.Context, req *models.GetStandardInfoDTO) ([]*models.StandardInfo, error)
	Create(ctx context.Context, dto *models.StandardInfoDTO) error
	Update(ctx context.Context, dto *models.StandardInfoDTO) error
	Delete(ctx context.Context, dto *models.DeleteStandardInfoDTO) error
}

func (r *StandardInfoRepo) Get(ctx context.Context, req *models.GetStandardInfoDTO) ([]*models.StandardInfo, error) {
	query := fmt.Sprintf(`SELECT ps.id, dn_title, pn_title, standard_id, flange_standard_id, fs.title as flange_title, 
		fs.code as flange_code, s.title as standard_title
		FROM %s AS ps
		INNER JOIN %s AS fs ON fs.id=flange_standard_id
		INNER JOIN %s AS s ON s.id=standard_id 
		ORDER BY count`,
		PutgStandardTable, FlangeStandardTable, StandardTable,
	)
	data := []*pg_models.StandardInfo{}

	if err := r.db.SelectContext(ctx, &data, query); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}

	standards := []*models.StandardInfo{}
	for _, ps := range data {
		standards = append(standards, &models.StandardInfo{
			Id:      ps.Id,
			DnTitle: ps.DnTitle,
			PnTitle: ps.PnTitle,
			FlangeStandard: &base.FlangeStandard{
				Id:    ps.FlangeId,
				Title: ps.FlangeTitle,
				Code:  ps.FlangeCode,
			},
			Standard: &base.Standard{
				Id:    ps.StandardId,
				Title: ps.StandardTitle,
			},
		})
	}

	return standards, nil
}

func (r *StandardInfoRepo) Create(ctx context.Context, dto *models.StandardInfoDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s (id, flange_standard_id, count, dn_title, pn_title) VALUES ($1, $2, $3, $4, $5)`, PutgStandardTable)
	dto.Id = uuid.NewString()

	_, err := r.db.ExecContext(ctx, query, dto.Id, dto.FlangeStandardId, dto.Count, dto.DnTitle, dto.PnTitle)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *StandardInfoRepo) Update(ctx context.Context, dto *models.StandardInfoDTO) error {
	query := fmt.Sprintf(`UPDATE %s SET flange_standard_id=$1, count=$2, dn_title=$3, pn_title=$4 WHERE id=$5`, PutgStandardTable)

	_, err := r.db.ExecContext(ctx, query, dto.FlangeStandardId, dto.Count, dto.DnTitle, dto.PnTitle, dto.Id)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *StandardInfoRepo) Delete(ctx context.Context, dto *models.DeleteStandardInfoDTO) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE id=$1`, PutgStandardTable)

	_, err := r.db.ExecContext(ctx, query, dto.Id)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

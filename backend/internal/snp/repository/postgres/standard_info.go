package postgres

import (
	"context"
	"fmt"
	"strings"

	base "github.com/Alexander272/new-sealur-pro/internal/models"
	"github.com/Alexander272/new-sealur-pro/internal/snp/models"
	"github.com/Alexander272/new-sealur-pro/internal/snp/repository/postgres/pq_models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type StandardInfoRepo struct {
	db *sqlx.DB
}

func NewStandardInfoRepo(db *sqlx.DB) *StandardInfoRepo {
	return &StandardInfoRepo{db: db}
}

type StandardInfo interface {
	GetAll(ctx context.Context, req *models.GetStandardInfoDTO) ([]*models.StandardInfo, error)
	GetDefault(ctx context.Context) (*models.StandardInfo, error)
	Create(ctx context.Context, dto *models.StandardInfoDTO) error
	CreateSeveral(ctx context.Context, dto []*models.StandardInfoDTO) error
	Update(ctx context.Context, dto *models.StandardInfoDTO) error
	Delete(ctx context.Context, dto *models.DeleteStandardInfoDTO) error
}

func (r *StandardInfoRepo) GetAll(ctx context.Context, req *models.GetStandardInfoDTO) ([]*models.StandardInfo, error) {
	query := fmt.Sprintf(`SELECT ss.id, dn_title, pn_title, has_d2, standard_id, flange_standard_id, s.title as standard_title, 
		fs.title as flange_title, fs.code as flange_code
		FROM %s AS ss 
		INNER JOIN %s AS s ON s.id=standard_id 
		INNER JOIN %s AS fs ON fs.id=flange_standard_id 
		ORDER BY count`,
		SnpStandardTable, StandardTable, FlangeStandardTable,
	)
	data := []*pq_models.StandardInfo{}

	if err := r.db.SelectContext(ctx, &data, query); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}

	standards := []*models.StandardInfo{}
	for _, s := range data {
		standards = append(standards, &models.StandardInfo{
			Id:      s.Id,
			DnTitle: s.DnTitle,
			PnTitle: s.PnTitle,
			HasD2:   s.HasD2,
			Standard: &base.Standard{
				Id:    s.StandardId,
				Title: s.StandardTitle,
			},
			FlangeStandard: &base.FlangeStandard{
				Id:    s.FlangeId,
				Title: s.FlangeTitle,
				Code:  s.FlangeCode,
			},
		})
	}

	return standards, nil
}

func (r *StandardInfoRepo) GetDefault(ctx context.Context) (*models.StandardInfo, error) {
	query := fmt.Sprintf(`SELECT %s.id, standard_id	FROM %s INNER JOIN %s ON %s.id=standard_id WHERE is_default=true ORDER BY count LIMIT 1`,
		SnpStandardTable, SnpStandardTable, StandardTable, StandardTable,
	)
	data := &pq_models.StandardInfo{}

	if err := r.db.GetContext(ctx, &data, query); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}

	standard := &models.StandardInfo{
		Id: data.Id,
		Standard: &base.Standard{
			Id: data.StandardId,
		},
	}

	return standard, nil
}

func (r *StandardInfoRepo) Create(ctx context.Context, dto *models.StandardInfoDTO) error {
	query := fmt.Sprintf("INSERT INTO %s(id, standard_id, flange_standard_id, dn_title, pn_title) VALUES ($1, $2, $3, $4, $5)", SnpStandardTable)
	id := uuid.New()

	_, err := r.db.ExecContext(ctx, query, id, dto.StandardId, dto.FlangeStandardId, dto.DnTitle, dto.PnTitle)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *StandardInfoRepo) CreateSeveral(ctx context.Context, dto []*models.StandardInfoDTO) error {
	query := fmt.Sprintf("INSERT INTO %s (id, standard_id, flange_standard_id, dn_title, pn_title) VALUES ", SnpStandardTable)

	args := make([]interface{}, 0)
	values := make([]string, 0, len(dto))

	c := 5
	for i, f := range dto {
		id := uuid.New()
		values = append(values, fmt.Sprintf("($%d, $%d, $%d, $%d, $%d)", i*c+1, i*c+2, i*c+3, i*c+4, i*c+5))
		args = append(args, id, f.StandardId, f.FlangeStandardId, f.DnTitle, f.PnTitle)
	}
	query += strings.Join(values, ", ")

	_, err := r.db.ExecContext(ctx, query, args...)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *StandardInfoRepo) Update(ctx context.Context, dto *models.StandardInfoDTO) error {
	query := fmt.Sprintf("UPDATE %s	SET standard_id=$1, flange_standard_id=$2, dn_title=$3, pn_title=$4 WHERE id=$5", SnpStandardTable)

	_, err := r.db.ExecContext(ctx, query, dto.StandardId, dto.FlangeStandardId, dto.DnTitle, dto.PnTitle, dto.Id)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *StandardInfoRepo) Delete(ctx context.Context, dto *models.DeleteStandardInfoDTO) error {
	query := fmt.Sprintf("DELETE FROM %s WHERE id=$1", SnpStandardTable)

	if _, err := r.db.ExecContext(ctx, query, dto.Id); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

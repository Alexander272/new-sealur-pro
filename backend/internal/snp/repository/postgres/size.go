package postgres

import (
	"context"
	"fmt"
	"strings"

	"github.com/Alexander272/new-sealur-pro/internal/snp/models"
	"github.com/Alexander272/new-sealur-pro/internal/snp/repository/postgres/pq_models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
)

type SizeRepo struct {
	db *sqlx.DB
}

func NewSizeRepo(db *sqlx.DB) *SizeRepo {
	return &SizeRepo{db: db}
}

type Size interface {
	GetDn(ctx context.Context, req *models.GetDnDTO) ([]*models.Dn, error)
	Get(ctx context.Context, req *models.GetSizeDTO) ([]*models.Size, error)
	GetGrouped(ctx context.Context, req *models.GetGroupedSize) ([]*models.GroupedSize, error)
	Create(ctx context.Context, dto *models.SizeDTO) error
	CreateSeveral(ctx context.Context, dto []*models.SizeDTO) error
	Update(ctx context.Context, dto *models.SizeDTO) error
	Delete(ctx context.Context, dto *models.DeleteSizeDTO) error
}

func (r *SizeRepo) GetDn(ctx context.Context, req *models.GetDnDTO) ([]*models.Dn, error) {
	query := fmt.Sprintf(`SELECT DISTINCT(dn), dn_alt, COALESCE(CASE WHEN $1 THEN d2 END, '') AS d2 
		FROM %s WHERE snp_type_id=$2 ORDER BY dn_alt`,
		SizeTable,
	)
	data := []*models.Dn{}

	if err := r.db.SelectContext(ctx, &data, query, req.HasD2, req.TypeId); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *SizeRepo) Get(ctx context.Context, req *models.GetSizeDTO) ([]*models.Size, error) {
	query := fmt.Sprintf(`SELECT id, dn, pn, pn_alt, d4, d3, d2, d1, h, s2, s3
		FROM %s WHERE snp_type_id=$1 AND dn=$2 ORDER BY count`,
		SizeTable,
	)
	tmp := []*pq_models.Size{}

	if err := r.db.SelectContext(ctx, &tmp, query, req.TypeId, req.Dn); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}

	data := []*models.Size{}
	for _, item := range tmp {
		data = append(data, &models.Size{
			Id:    item.Id,
			Dn:    item.Dn,
			Pn:    item.Pn,
			PnAlt: item.PnAlt,
			D4:    item.D4,
			D3:    item.D3,
			D2:    item.D2,
			D1:    item.D1,
			H:     item.H,
			S2:    item.S2,
			S3:    item.S3,
		})
	}
	return data, nil
}

// DEPRECATED
func (r *SizeRepo) GetGrouped(ctx context.Context, req *models.GetGroupedSize) ([]*models.GroupedSize, error) {
	query := fmt.Sprintf(`SELECT id, dn, dn_mm, pn, pn, d4, d3, d2, d1, h, s2, s3
		FROM %s WHERE snp_type_id=$1 ORDER BY count`,
		SizeTable,
	)
	data := []*pq_models.OldSize{}

	if err := r.db.SelectContext(ctx, &data, query, req.TypeId); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}

	sizes := []*models.GroupedSize{}
	for i, ss := range data {
		Pn := []*models.Pn{}
		for _, v := range ss.PnMpa {
			Pn = append(Pn, &models.Pn{
				Mpa: v,
			})
		}
		for j, v := range ss.PnKg {
			Pn[j].Kg = v
		}

		data := &models.SizeItem{
			Id: ss.Id,
			Pn: Pn,
			D4: ss.D4,
			D3: ss.D3,
			D2: ss.D2,
			D1: ss.D1,
			H:  ss.H,
			S3: ss.S3,
			S2: ss.S2,
		}

		if i > 0 && ss.Dn == sizes[len(sizes)-1].Dn {
			sizes[len(sizes)-1].Sizes = append(sizes[len(sizes)-1].Sizes, data)
		} else {
			sizes = append(sizes, &models.GroupedSize{
				Id:    ss.Id,
				Dn:    ss.Dn,
				DnMm:  ss.DnMm,
				Sizes: []*models.SizeItem{data},
			})

			if req.HasD2 {
				sizes[len(sizes)-1].D2 = ss.D2
			}
		}
	}

	return sizes, nil
}

func (r *SizeRepo) Create(ctx context.Context, dto *models.SizeDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, snp_type_id, count, dn, dn_alt, pn, pn_alt, d4, d3, d2, d1, h, s2, s3)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
		SizeTable,
	)
	id := uuid.New()

	_, err := r.db.ExecContext(ctx, query, id, dto.SnpTypeId, dto.Count, dto.Dn, dto.DnAlt, dto.Pn, dto.PnAlt, dto.D4, dto.D3, dto.D2, dto.D1,
		pq.Array(dto.H), pq.Array(dto.S2), pq.Array(dto.S3),
	)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}

	return nil
}

func (r *SizeRepo) CreateSeveral(ctx context.Context, dto []*models.SizeDTO) error {
	query := fmt.Sprintf("INSERT INTO %s (id, snp_type_id, count, dn, dn_alt, pn, pn_alt, d4, d3, d2, d1, h, s2, s3) VALUES ", SizeTable)

	args := make([]interface{}, 0)
	values := make([]string, 0, len(dto))

	c := 14
	for i, s := range dto {
		id := uuid.New()

		values = append(values, fmt.Sprintf("($%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d)",
			i*c+1, i*c+2, i*c+3, i*c+4, i*c+5, i*c+6, i*c+7, i*c+8, i*c+9, i*c+10, i*c+11, i*c+12, i*c+13, i*c+14,
		))
		args = append(args, id, s.SnpTypeId, s.Count, s.Dn, s.DnAlt, s.Pn, s.PnAlt, s.D4, s.D3, s.D2, s.D1, pq.Array(s.H), pq.Array(s.S2), pq.Array(s.S3))
	}
	query += strings.Join(values, ", ")

	_, err := r.db.ExecContext(ctx, query, args...)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *SizeRepo) Update(ctx context.Context, dto *models.SizeDTO) error {
	query := fmt.Sprintf(`UPDATE %s SET snp_type_id=$1, count=$2, dn=$3, dn_alt=$4, pn=$5, pn_alt=$6, d4=$7, d3=$8, d2=$9, d1=$10,
		h=$11, s2=$12, s3=$13 WHERE id=$14`,
		SizeTable,
	)

	_, err := r.db.ExecContext(ctx, query, dto.SnpTypeId, dto.Count, dto.Dn, dto.DnAlt, dto.Pn, dto.PnAlt, dto.D4, dto.D3, dto.D2, dto.D1,
		pq.Array(dto.H), pq.Array(dto.S2), pq.Array(dto.S3), dto.Id,
	)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *SizeRepo) Delete(ctx context.Context, dto *models.DeleteSizeDTO) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE id=$1`, SizeTable)

	if _, err := r.db.ExecContext(ctx, query, dto.Id); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

package postgres

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/putg/models"
	"github.com/Alexander272/new-sealur-pro/internal/putg/repository/postgres/pg_models"
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
	Get(ctx context.Context, req *models.GetGroupedSizeDTO) ([]*models.GroupedSize, error)
	Create(ctx context.Context, dto *models.SizeDTO) error
	CreateSeveral(ctx context.Context, dto []*models.SizeDTO) error
	Update(ctx context.Context, dto *models.SizeDTO) error
	Delete(ctx context.Context, dto *models.DeleteSizeDTO) error
}

func (r *SizeRepo) Get(ctx context.Context, req *models.GetGroupedSizeDTO) ([]*models.GroupedSize, error) {
	query := fmt.Sprintf(`SELECT id, dn, dn_mm, pn_mpa, pn_kg, d4, d3, d2, d1, h FROM %s
		WHERE putg_flange_type_id=$1 AND base_construction_id=$2 AND base_fillers_id @> $3::uuid[] ORDER BY count`,
		PutgSizeTable,
	)
	data := []*pg_models.Size{}

	if err := r.db.SelectContext(ctx, &data, query, req.FlangeTypeId, req.BaseConstructionId, pq.Array([]string{req.BaseFillerId})); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}

	sizes := []*models.GroupedSize{}
	for i, s := range data {
		Pn := []*models.Pn{}
		for _, v := range s.PnMpa {
			Pn = append(Pn, &models.Pn{
				Mpa: v,
			})
		}
		for j, v := range s.PnKg {
			Pn[j].Kg = v
		}

		data := &models.Size{
			Pn: Pn,
			D4: s.D4,
			D3: s.D3,
			D2: s.D2,
			D1: s.D1,
			H:  s.H,
		}

		if i > 0 && s.Dn == sizes[len(sizes)-1].Dn {
			sizes[len(sizes)-1].Sizes = append(sizes[len(sizes)-1].Sizes, data)
		} else {
			sizes = append(sizes, &models.GroupedSize{
				Id:    s.Id,
				Dn:    s.Dn,
				DnMm:  s.DnMm,
				Sizes: []*models.Size{data},
			})
		}
	}

	return sizes, nil
}

func (r *SizeRepo) Create(ctx context.Context, dto *models.SizeDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, putg_flange_type_id, base_construction_id, base_fillers_id, count, dn, dn_mm, pn_mpa, 
		pn_kg, d4, d3, d2, d1, h)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
		PutgSizeTable,
	)
	dto.Id = uuid.NewString()

	pnMpa := pq.StringArray{}
	pnKg := pq.StringArray{}

	for _, p := range dto.Pn {
		pnMpa = append(pnMpa, p.Mpa)
		if p.Kg != "" {
			pnKg = append(pnKg, p.Kg)
		}
	}

	_, err := r.db.ExecContext(ctx, query, dto.Id, dto.FlangeTypeId, dto.BaseConstructionId, pq.Array(dto.BaseFillerId), dto.Count,
		dto.Dn, dto.DnMm, pnMpa, pnKg, dto.D4, dto.D3, dto.D2, dto.D1, pq.Array(dto.H),
	)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *SizeRepo) CreateSeveral(ctx context.Context, dto []*models.SizeDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, putg_flange_type_id, base_construction_id, base_fillers_id, count, dn, dn_mm, pn_mpa, 
		pn_kg, d4, d3, d2, d1, h) VALUES (:id, :putg_flange_type_id, :base_construction_id, :base_fillers_id, :count, :dn, :dn_mm, :pn_mpa, 
		:pn_kg, :d4, :d3, :d2, :d1, :h)`,
		PutgSizeTable,
	)
	data := []*pg_models.SizeDTO{}
	for _, d := range dto {
		pnMpa := pq.StringArray{}
		pnKg := pq.StringArray{}
		for _, p := range d.Pn {
			pnMpa = append(pnMpa, p.Mpa)
			if p.Kg != "" {
				pnKg = append(pnKg, p.Kg)
			}
		}

		data = append(data, &pg_models.SizeDTO{
			Id:                 d.Id,
			FlangeTypeId:       d.FlangeTypeId,
			BaseConstructionId: d.BaseConstructionId,
			BaseFillerId:       pq.StringArray(d.BaseFillerId),
			Count:              d.Count,
			Dn:                 d.Dn,
			DnMm:               d.DnMm,
			PnMpa:              pnMpa,
			PnKg:               pnKg,
			D4:                 d.D4,
			D3:                 d.D3,
			D2:                 d.D2,
			D1:                 d.D1,
			H:                  pq.StringArray(d.H),
		})
	}

	_, err := r.db.NamedExecContext(ctx, query, data)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *SizeRepo) Update(ctx context.Context, dto *models.SizeDTO) error {
	query := fmt.Sprintf(`UPDATE %s SET putg_flange_type_id=$1, count=$2, dn=$3, dn_mm=$4, pn_mpa=$5, pn_kg=$6, d4=$7, d3=$8, d2=$9, d1=$10,
		h=$11, base_construction_id=$12, base_fillers_id=$13 WHERE id=$14`, PutgSizeTable,
	)

	pnMpa := pq.StringArray{}
	pnKg := pq.StringArray{}

	for _, p := range dto.Pn {
		pnMpa = append(pnMpa, p.Mpa)
		if p.Kg != "" {
			pnKg = append(pnKg, p.Kg)
		}
	}

	_, err := r.db.ExecContext(ctx, query, dto.FlangeTypeId, dto.Count, dto.Dn, dto.DnMm, pnMpa, pnKg, dto.D4, dto.D3, dto.D2, dto.D1,
		pq.Array(dto.H), dto.BaseConstructionId, pq.Array(dto.BaseFillerId), dto.Id,
	)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *SizeRepo) Delete(ctx context.Context, dto *models.DeleteSizeDTO) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE id=$1`, PutgSizeTable)

	if _, err := r.db.ExecContext(ctx, query, dto.Id); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

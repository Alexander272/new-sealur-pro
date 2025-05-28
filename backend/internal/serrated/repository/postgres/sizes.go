package postgres

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/serrated/models"
	"github.com/Alexander272/new-sealur-pro/internal/serrated/repository/postgres/pq_models"
	"github.com/jmoiron/sqlx"
)

type SizeRepo struct {
	db *sqlx.DB
}

func NewSizeRepo(db *sqlx.DB) *SizeRepo {
	return &SizeRepo{db: db}
}

type Size interface {
	Get(ctx context.Context, req *models.GetSizeDTO) ([]*models.Size, error)
	GetDn(ctx context.Context, req *models.GetDnDTO) ([]*models.Dn, error)
	Create(ctx context.Context, dto *models.SizeDTO) error
	Update(ctx context.Context, dto *models.SizeDTO) error
	Delete(ctx context.Context, dto *models.DeleteSizeDTO) error
}

func (r *SizeRepo) GetDn(ctx context.Context, req *models.GetDnDTO) ([]*models.Dn, error) {
	query := fmt.Sprintf(`SELECT DISTINCT(dn), dn_alt FROM %s AS s INNER JOIN %s AS tb ON type_id=tb.id
		WHERE flange_id=$1 ORDER BY dn_alt`,
		SizeTable, TypeTable,
	)

	data := []*models.Dn{}
	if err := r.db.SelectContext(ctx, &data, query, req.FlangeId); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *SizeRepo) Get(ctx context.Context, req *models.GetSizeDTO) ([]*models.Size, error) {
	query := fmt.Sprintf(`SELECT id, dn, dn_alt, pn, pn_alt, d4, d3, d2, d1, h
		FROM %s WHERE type_id=$1 AND dn_alt=$2 ORDER BY count`,
		SizeTable,
	)

	tmp := []*pq_models.Size{}
	if err := r.db.SelectContext(ctx, &tmp, query, req.TypeId, req.Dn); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}

	data := []*models.Size{}
	for _, v := range tmp {
		data = append(data, &models.Size{
			Id:          v.Id,
			Dn:          v.Dn,
			DnAlt:       v.DnAlt,
			Pn:          v.Pn,
			PnAlt:       v.PnAlt,
			D4:          v.D4,
			D3:          v.D3,
			D2:          v.D2,
			D1:          v.D1,
			Thicknesses: v.Thicknesses,
		})
	}
	return data, nil
}

func (r *SizeRepo) Create(ctx context.Context, dto *models.SizeDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s (id, count, dn, dn_alt, pn, pn_alt, d4, d3, d2, d1, h, type_id) 
		VALUES (:id, :count, :dn, :dn_alt, :pn, :pn_alt, :d4, :d3, :d2, :d1, :h, :type_id)`,
		SizeTable,
	)

	tmp := pq_models.Size{
		Id:          dto.Id,
		Dn:          dto.Dn,
		DnAlt:       dto.DnAlt,
		Pn:          dto.Pn,
		PnAlt:       dto.PnAlt,
		D4:          dto.D4,
		D3:          dto.D3,
		D2:          dto.D2,
		D1:          dto.D1,
		Thicknesses: dto.Thicknesses,
	}

	_, err := r.db.NamedExecContext(ctx, query, tmp)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *SizeRepo) Update(ctx context.Context, dto *models.SizeDTO) error {
	query := fmt.Sprintf(`UPDATE %s SET count=:count, dn=:dn, dn_alt=:dn_alt, pn=:pn, pn_alt=:pn_alt, 
		d4=:d4, d3=:d3, d2=:d2, d1=:d1, h=:h WHERE id=:id`,
		SizeTable,
	)

	tmp := pq_models.Size{
		Id:          dto.Id,
		Dn:          dto.Dn,
		DnAlt:       dto.DnAlt,
		Pn:          dto.Pn,
		PnAlt:       dto.PnAlt,
		D4:          dto.D4,
		D3:          dto.D3,
		D2:          dto.D2,
		D1:          dto.D1,
		Thicknesses: dto.Thicknesses,
	}

	_, err := r.db.NamedExecContext(ctx, query, tmp)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *SizeRepo) Delete(ctx context.Context, dto *models.DeleteSizeDTO) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE id=:id`, SizeTable)

	_, err := r.db.NamedExecContext(ctx, query, dto)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

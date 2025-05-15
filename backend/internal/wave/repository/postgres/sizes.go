package postgres

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/wave/models"
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
		SizeTable, WaveTypeTable,
	)

	data := []*models.Dn{}
	if err := r.db.SelectContext(ctx, &data, query, req.FlangeId); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *SizeRepo) Get(ctx context.Context, req *models.GetSizeDTO) ([]*models.Size, error) {
	query := fmt.Sprintf(`SELECT id, dn, dn_alt, pn, pn_alt, d4, d3, d2, d1
		FROM %s WHERE type_id=$1 AND dn_alt=$2 ORDER BY count`,
		SizeTable,
	)

	data := []*models.Size{}
	if err := r.db.SelectContext(ctx, &data, query, req.TypeId, req.Dn); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *SizeRepo) Create(ctx context.Context, dto *models.SizeDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s (id, count, dn, dn_alt, pn, pn_alt, d4, d3, d2, d1, type_id) 
		VALUES (:id, :count, :dn, :dn_alt, :pn, :pn_alt, :d4, :d3, :d2, :d1, :type_id)`,
		SizeTable,
	)

	_, err := r.db.NamedExecContext(ctx, query, dto)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *SizeRepo) Update(ctx context.Context, dto *models.SizeDTO) error {
	query := fmt.Sprintf(`UPDATE %s SET count=:count, dn=:dn, dn_alt=:dn_alt, pn=:pn, pn_alt=:pn_alt, 
		d4=:d4, d3=:d3, d2=:d2, d1=:d1 WHERE id=:id`,
		SizeTable,
	)

	_, err := r.db.NamedExecContext(ctx, query, dto)
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

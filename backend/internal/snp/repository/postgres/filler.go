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

type FillerRepo struct {
	db *sqlx.DB
}

func NewFillerRepo(db *sqlx.DB) *FillerRepo {
	return &FillerRepo{db: db}
}

type Filler interface {
	GetAll(ctx context.Context, req *models.GetFillerDTO) ([]*models.Filler, error)
	Create(ctx context.Context, dto *models.FillerDTO) error
	CreateSeveral(ctx context.Context, dto []*models.FillerDTO) error
	Update(ctx context.Context, dto *models.FillerDTO) error
	Delete(ctx context.Context, dto *models.FillerDTO) error
}

func (r *FillerRepo) GetAll(ctx context.Context, req *models.GetFillerDTO) ([]*models.Filler, error) {
	query := fmt.Sprintf(`SELECT %s.id, %s.title, base_code, code, description, designation, disabled_types, %s.title as temperature
		FROM %s INNER JOIN %s on %s.id=temperature_id WHERE standard_id=$1 ORDER BY base_code`,
		SnpFillerNewTable, SnpFillerNewTable, TemperatureTable, SnpFillerNewTable, TemperatureTable, TemperatureTable,
	)
	data := []*pq_models.Filler{}

	if err := r.db.SelectContext(ctx, &data, query, req.StandardId); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	fillers := []*models.Filler{}

	for _, s := range data {
		fillers = append(fillers, &models.Filler{
			Id:            s.Id,
			Temperature:   s.Temperature,
			BaseCode:      s.BaseCode,
			Code:          s.Code,
			Title:         s.Title,
			Description:   s.Description,
			Designation:   s.Designation,
			DisabledTypes: s.DisabledTypes,
		})
	}
	return fillers, nil
}

func (r *FillerRepo) Create(ctx context.Context, dto *models.FillerDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s (id, standard_id, temperature_id, base_code, code, title, description, designation, disabled_types) 
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`, SnpFillerTable)
	id := uuid.New()

	_, err := r.db.ExecContext(ctx, query, id, dto.StandardId, dto.TemperatureId, dto.BaseCode, dto.Code, dto.Title, dto.Description,
		dto.Designation, pq.Array(dto.DisabledTypes),
	)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *FillerRepo) CreateSeveral(ctx context.Context, dto []*models.FillerDTO) error {
	query := fmt.Sprintf("INSERT INTO %s (id, standard_id, temperature_id, base_code, code, title, description, designation, disabled_types) VALUES ", SnpFillerTable)

	args := make([]interface{}, 0)
	values := make([]string, 0, len(dto))

	c := 9
	for i, f := range dto {
		id := uuid.New()
		values = append(values, fmt.Sprintf("($%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d)", i*c+1, i*c+2, i*c+3, i*c+4, i*c+5, i*c+6, i*c+7, i*c+8, i*c+9))
		args = append(args, id, f.StandardId, f.TemperatureId, f.BaseCode, f.Code, f.Title, f.Description, f.Designation, pq.Array(f.DisabledTypes))
	}
	query += strings.Join(values, ", ")

	_, err := r.db.ExecContext(ctx, query, args...)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *FillerRepo) Update(ctx context.Context, dto *models.FillerDTO) error {
	query := fmt.Sprintf(`UPDATE %s	SET standard_id=$1, temperature_id=$2, base_code=$3, code=$4, title=$5, description=$6, designation=$7,
		disabled_types=$8 WHERE id=$9`, SnpFillerTable)

	_, err := r.db.ExecContext(ctx, query, dto.StandardId, dto.TemperatureId, dto.BaseCode, dto.Code, dto.Title, dto.Description,
		dto.Designation, pq.Array(dto.DisabledTypes), dto.Id,
	)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *FillerRepo) Delete(ctx context.Context, dto *models.FillerDTO) error {
	query := fmt.Sprintf("DELETE FROM %s WHERE id=$1", SnpFillerTable)

	if _, err := r.db.ExecContext(ctx, query, dto.Id); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

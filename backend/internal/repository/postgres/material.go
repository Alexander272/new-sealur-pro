package postgres

import (
	"context"
	"fmt"
	"strings"

	"github.com/Alexander272/new-sealur-pro/internal/models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type MaterialRepo struct {
	db *sqlx.DB
}

func NewMaterialRepo(db *sqlx.DB) *MaterialRepo {
	return &MaterialRepo{db: db}
}

type Material interface {
	GetAll(ctx context.Context, req *models.GetMaterialDTO) ([]*models.Material, error)
	Create(ctx context.Context, dto *models.MaterialDTO) error
	CreateSeveral(ctx context.Context, dto []*models.MaterialDTO) error
	Update(ctx context.Context, dto *models.MaterialDTO) error
	Delete(ctx context.Context, dto *models.DeleteMaterialDTO) error
}

func (r *MaterialRepo) GetAll(ctx context.Context, req *models.GetMaterialDTO) ([]*models.Material, error) {
	query := fmt.Sprintf("SELECT id, title, code, short_en, short_rus FROM %s", MaterialTable)
	data := []*models.Material{}

	if err := r.db.SelectContext(ctx, &data, query); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *MaterialRepo) Create(ctx context.Context, dto *models.MaterialDTO) error {
	query := fmt.Sprintf("INSERT INTO %s (id, title, code, short_en, short_rus) VALUES ($1, $2, $3, $4, $5)", MaterialTable)
	id := uuid.New()

	_, err := r.db.ExecContext(ctx, query, id, dto.Title, dto.Code, dto.ShortEn, dto.ShortRus)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *MaterialRepo) CreateSeveral(ctx context.Context, dto []*models.MaterialDTO) error {
	query := fmt.Sprintf("INSERT INTO %s (id, title, code, short_en, short_rus) VALUES ", MaterialTable)

	args := make([]interface{}, 0)
	values := make([]string, 0, len(dto))

	c := 5
	for i, m := range dto {
		id := uuid.New()
		values = append(values, fmt.Sprintf("($%d, $%d, $%d, $%d, $%d)", i*c+1, i*c+2, i*c+3, i*c+4, i*c+5))
		args = append(args, id, m.Title, m.Code, m.ShortEn, m.ShortRus)
	}
	query += strings.Join(values, ", ")

	_, err := r.db.ExecContext(ctx, query, args...)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *MaterialRepo) Update(ctx context.Context, dto *models.MaterialDTO) error {
	query := fmt.Sprintf("UPDATE %s	SET title=$1, code=$2, short_en=$3, short_rus=$4 WHERE id=$5", MaterialTable)

	_, err := r.db.Exec(query, dto.Title, dto.Code, dto.ShortEn, dto.ShortRus, dto.Id)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *MaterialRepo) Delete(ctx context.Context, dto *models.DeleteMaterialDTO) error {
	query := fmt.Sprintf("DELETE FROM %s WHERE id=$1", MaterialTable)

	if _, err := r.db.Exec(query, dto.Id); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

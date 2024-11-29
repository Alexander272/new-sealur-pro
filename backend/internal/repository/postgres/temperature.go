package postgres

import (
	"context"
	"fmt"
	"strings"

	"github.com/Alexander272/new-sealur-pro/internal/models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type TemperatureRepo struct {
	db *sqlx.DB
}

func NewTemperatureRepo(db *sqlx.DB) *TemperatureRepo {
	return &TemperatureRepo{db: db}
}

type Temperature interface {
	GetAll(ctx context.Context, req *models.GetTemperatureDTO) ([]*models.Temperature, error)
	Create(ctx context.Context, dto *models.TemperatureDTO) error
	CreateSeveral(ctx context.Context, dto []*models.TemperatureDTO) error
	Update(ctx context.Context, dto *models.TemperatureDTO) error
	Delete(ctx context.Context, dto *models.DeleteTemperatureDTO) error
}

func (r *TemperatureRepo) GetAll(ctx context.Context, req *models.GetTemperatureDTO) ([]*models.Temperature, error) {
	query := fmt.Sprintf("SELECT id, title FROM %s", TemperatureTable)
	data := []*models.Temperature{}

	if err := r.db.SelectContext(ctx, &data, query); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *TemperatureRepo) Create(ctx context.Context, dto *models.TemperatureDTO) error {
	query := fmt.Sprintf("INSERT INTO %s (id, title) VALUES ($1, $2)", TemperatureTable)
	id := uuid.New()

	_, err := r.db.ExecContext(ctx, query, id, dto.Title)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *TemperatureRepo) CreateSeveral(ctx context.Context, dto []*models.TemperatureDTO) error {
	query := fmt.Sprintf("INSERT INTO %s (id, title) VALUES ", TemperatureTable)

	args := make([]interface{}, 0)
	values := make([]string, 0, len(dto))

	c := 2
	for i, m := range dto {
		id := uuid.New()
		values = append(values, fmt.Sprintf("($%d, $%d)", i*c+1, i*c+2))
		args = append(args, id, m.Title)
	}
	query += strings.Join(values, ", ")

	_, err := r.db.ExecContext(ctx, query, args...)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *TemperatureRepo) Update(ctx context.Context, dto *models.TemperatureDTO) error {
	query := fmt.Sprintf("UPDATE %s	SET title=$1, code=$2 WHERE id=$3", TemperatureTable)

	_, err := r.db.ExecContext(ctx, query, dto.Title, dto.Id)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *TemperatureRepo) Delete(ctx context.Context, dto *models.DeleteTemperatureDTO) error {
	query := fmt.Sprintf("DELETE FROM %s WHERE id=$1", TemperatureTable)

	if _, err := r.db.ExecContext(ctx, query, dto.Id); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

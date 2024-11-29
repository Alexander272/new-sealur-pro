package postgres

import (
	"context"
	"fmt"
	"strings"

	"github.com/Alexander272/new-sealur-pro/internal/models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type StandardRepo struct {
	db *sqlx.DB
}

func NewStandardRepo(db *sqlx.DB) *StandardRepo {
	return &StandardRepo{db: db}
}

type Standard interface {
	GetAll(ctx context.Context, req *models.GetStandardDTO) ([]*models.Standard, error)
	GetDefault(ctx context.Context) (*models.Standard, error)
	Create(ctx context.Context, dto *models.StandardDTO) error
	CreateSeveral(ctx context.Context, dto []*models.StandardDTO) error
	Update(ctx context.Context, dto *models.StandardDTO) error
	Delete(ctx context.Context, dto *models.DeleteStandardDTO) error
}

func (r *StandardRepo) GetAll(ctx context.Context, req *models.GetStandardDTO) ([]*models.Standard, error) {
	query := fmt.Sprintf("SELECT id, title FROM %s", StandardTable)
	data := []*models.Standard{}

	if err := r.db.SelectContext(ctx, &data, query); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *StandardRepo) GetDefault(ctx context.Context) (*models.Standard, error) {
	query := fmt.Sprintf("SELECT id, title FROM %s WHERE is_default=true LIMIT 1", StandardTable)
	data := &models.Standard{}

	if err := r.db.GetContext(ctx, data, query); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *StandardRepo) Create(ctx context.Context, dto *models.StandardDTO) error {
	query := fmt.Sprintf("INSERT INTO %s (id, title) VALUES ($1, $2)", StandardTable)
	id := uuid.New()

	_, err := r.db.ExecContext(ctx, query, id, dto.Title)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *StandardRepo) CreateSeveral(ctx context.Context, dto []*models.StandardDTO) error {
	query := fmt.Sprintf("INSERT INTO %s (id, title, format) VALUES ", StandardTable)

	args := make([]interface{}, 0)
	values := make([]string, 0, len(dto))

	c := 2
	for i, s := range dto {
		id := uuid.New()
		values = append(values, fmt.Sprintf("($%d, $%d)", i*c+1, i*c+2))
		args = append(args, id, s.Title)
	}
	query += strings.Join(values, ", ")

	_, err := r.db.ExecContext(ctx, query, args...)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *StandardRepo) Update(ctx context.Context, dto *models.StandardDTO) error {
	query := fmt.Sprintf("UPDATE %s	SET title=$1 WHERE id=$2", StandardTable)

	_, err := r.db.ExecContext(ctx, query, dto.Title, dto.Id)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *StandardRepo) Delete(ctx context.Context, dto *models.DeleteStandardDTO) error {
	query := fmt.Sprintf("DELETE FROM %s WHERE id=$1", StandardTable)

	if _, err := r.db.ExecContext(ctx, query, dto.Id); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

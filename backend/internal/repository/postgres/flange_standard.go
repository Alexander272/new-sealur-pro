package postgres

import (
	"context"
	"fmt"
	"strings"

	"github.com/Alexander272/new-sealur-pro/internal/models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type FlangeStandardRepo struct {
	db *sqlx.DB
}

func NewFlangeStandardRepo(db *sqlx.DB) *FlangeStandardRepo {
	return &FlangeStandardRepo{db: db}
}

type FlangeStandard interface {
	GetAll(ctx context.Context, req *models.GetFlangeStandardDTO) ([]*models.FlangeStandard, error)
	Create(ctx context.Context, dto *models.FlangeStandardDTO) error
	CreateSeveral(ctx context.Context, dto []*models.FlangeStandardDTO) error
	Update(ctx context.Context, dto *models.FlangeStandardDTO) error
	Delete(ctx context.Context, dto *models.DeleteFlangeStandardDTO) error
}

func (r *FlangeStandardRepo) GetAll(ctx context.Context, req *models.GetFlangeStandardDTO) ([]*models.FlangeStandard, error) {
	query := fmt.Sprintf("SELECT id, title, code FROM %s", FlangeStandardTable)
	data := []*models.FlangeStandard{}

	if err := r.db.SelectContext(ctx, &data, query); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *FlangeStandardRepo) Create(ctx context.Context, dto *models.FlangeStandardDTO) error {
	query := fmt.Sprintf("INSERT INTO %s (id, title, code) VALUES ($1, $2, $3)", FlangeStandardTable)
	id := uuid.New()

	_, err := r.db.ExecContext(ctx, query, id, dto.Title, dto.Code)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *FlangeStandardRepo) CreateSeveral(ctx context.Context, dto []*models.FlangeStandardDTO) error {
	query := fmt.Sprintf("INSERT INTO %s (id, title, code) VALUES ", FlangeStandardTable)

	args := make([]interface{}, 0)
	values := make([]string, 0, len(dto))

	c := 3
	for i, s := range dto {
		id := uuid.New()
		values = append(values, fmt.Sprintf("($%d, $%d, $%d)", i*c+1, i*c+2, i*c+3))
		args = append(args, id, s.Title, s.Code)
	}
	query += strings.Join(values, ", ")

	_, err := r.db.ExecContext(ctx, query, args...)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *FlangeStandardRepo) Update(ctx context.Context, dto *models.FlangeStandardDTO) error {
	query := fmt.Sprintf("UPDATE %s	SET title=$1, code=$2 WHERE id=$3", FlangeStandardTable)

	_, err := r.db.ExecContext(ctx, query, dto.Title, dto.Code, dto.Id)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *FlangeStandardRepo) Delete(ctx context.Context, dto *models.DeleteFlangeStandardDTO) error {
	query := fmt.Sprintf("DELETE FROM %s WHERE id=$1", FlangeStandardTable)

	if _, err := r.db.ExecContext(ctx, query, dto.Id); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

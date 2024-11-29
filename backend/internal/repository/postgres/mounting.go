package postgres

import (
	"context"
	"fmt"
	"strings"

	"github.com/Alexander272/new-sealur-pro/internal/models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type MountingRepo struct {
	db *sqlx.DB
}

func NewMountingRepo(db *sqlx.DB) *MountingRepo {
	return &MountingRepo{db: db}
}

type Mounting interface {
	GetAll(ctx context.Context, req *models.GetMountingDTO) ([]*models.Mounting, error)
	Create(ctx context.Context, dto *models.MountingDTO) error
	CreateSeveral(ctx context.Context, dto []*models.MountingDTO) error
	Update(ctx context.Context, dto *models.MountingDTO) error
	Delete(ctx context.Context, dto *models.DeleteMountingDTO) error
}

func (r *MountingRepo) GetAll(ctx context.Context, req *models.GetMountingDTO) ([]*models.Mounting, error) {
	query := fmt.Sprintf("SELECT id, title FROM %s", MountingTable)
	data := []*models.Mounting{}

	if err := r.db.SelectContext(ctx, &data, query); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *MountingRepo) Create(ctx context.Context, dto *models.MountingDTO) error {
	query := fmt.Sprintf("INSERT INTO %s (id, title) VALUES ($1, $2)", MountingTable)
	id := uuid.New()

	_, err := r.db.ExecContext(ctx, query, id, dto.Title)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *MountingRepo) CreateSeveral(ctx context.Context, dto []*models.MountingDTO) error {
	query := fmt.Sprintf("INSERT INTO %s (id, title) VALUES ", MountingTable)

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

func (r *MountingRepo) Update(ctx context.Context, dto *models.MountingDTO) error {
	query := fmt.Sprintf("UPDATE %s	SET title=$1, code=$2 WHERE id=$3", MountingTable)

	_, err := r.db.ExecContext(ctx, query, dto.Title, dto.Id)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *MountingRepo) Delete(ctx context.Context, dto *models.DeleteMountingDTO) error {
	query := fmt.Sprintf("DELETE FROM %s WHERE id=$1", MountingTable)

	if _, err := r.db.ExecContext(ctx, query, dto.Id); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

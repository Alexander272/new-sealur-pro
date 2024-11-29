package postgres

import (
	"context"
	"fmt"
	"strings"

	"github.com/Alexander272/new-sealur-pro/internal/snp/models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type FlangeTypeRepo struct {
	db *sqlx.DB
}

func NewFlangeTypeRepo(db *sqlx.DB) *FlangeTypeRepo {
	return &FlangeTypeRepo{db: db}
}

type FlangeType interface {
	Get(ctx context.Context, req *models.GetFlangeTypeDTO) ([]*models.FlangeType, error)
	Create(ctx context.Context, dto *models.FlangeTypeDTO) error
	CreateSeveral(ctx context.Context, dto []*models.FlangeTypeDTO) error
	Update(ctx context.Context, dto *models.FlangeTypeDTO) error
	Delete(ctx context.Context, dto *models.DeleteFlangeTypeDTO) error
}

func (r *FlangeTypeRepo) Get(ctx context.Context, req *models.GetFlangeTypeDTO) ([]*models.FlangeType, error) {
	query := fmt.Sprintf("SELECT id, title, code FROM %s WHERE standard_id=$1", FlangeTypeSNPTable)
	data := []*models.FlangeType{}

	if err := r.db.SelectContext(ctx, &data, query, req.StandardId); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *FlangeTypeRepo) Create(ctx context.Context, dto *models.FlangeTypeDTO) error {
	query := fmt.Sprintf("INSERT INTO %s (id, title, code, standard_id) VALUES ($1, $2, $3, $4)", FlangeTypeSNPTable)
	id := uuid.New()

	_, err := r.db.ExecContext(ctx, query, id, dto.Title, dto.Code, dto.StandardId)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *FlangeTypeRepo) CreateSeveral(ctx context.Context, dto []*models.FlangeTypeDTO) error {
	query := fmt.Sprintf("INSERT INTO %s (id, title, code, standard_id) VALUES ", FlangeTypeSNPTable)

	args := make([]interface{}, 0)
	values := make([]string, 0, len(dto))

	c := 4
	for i, s := range dto {
		id := uuid.New()
		values = append(values, fmt.Sprintf("($%d, $%d, $%d, $%d)", i*c+1, i*c+2, i*c+3, i*c+4))
		args = append(args, id, s.Title, s.Code, s.StandardId)
	}
	query += strings.Join(values, ", ")

	_, err := r.db.ExecContext(ctx, query, args...)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *FlangeTypeRepo) Update(ctx context.Context, dto *models.FlangeTypeDTO) error {
	query := fmt.Sprintf("UPDATE %s	SET title=$1, code=$2, standard_id=$3 WHERE id=$4", FlangeTypeSNPTable)

	_, err := r.db.ExecContext(ctx, query, dto.Title, dto.Code, dto.StandardId, dto.Id)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *FlangeTypeRepo) Delete(ctx context.Context, dto *models.DeleteFlangeTypeDTO) error {
	query := fmt.Sprintf("DELETE FROM %s WHERE id=$1", FlangeTypeSNPTable)

	if _, err := r.db.ExecContext(ctx, query, dto.Id); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

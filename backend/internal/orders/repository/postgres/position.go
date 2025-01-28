package postgres

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	base "github.com/Alexander272/new-sealur-pro/internal/models"
	"github.com/Alexander272/new-sealur-pro/internal/orders/models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type PositionRepo struct {
	db *sqlx.DB
}

func NewPositionRepo(db *sqlx.DB) *PositionRepo {
	return &PositionRepo{db: db}
}

type Position interface {
	Get(ctx context.Context, req *models.GetPositionsDTO) ([]*models.Position, error)
	GetById(ctx context.Context, id string) (*models.PositionDTO, error)
	GetIdByTitle(ctx context.Context, req *models.GetPositionByTitle) (string, error)
	Copy(ctx context.Context, dto *models.CopyPositionDTO) error
	Create(ctx context.Context, dto *models.PositionDTO) error
	CreateSeveral(ctx context.Context, dto []*models.PositionDTO) error
	Update(ctx context.Context, dto *models.PositionDTO) error
	Delete(ctx context.Context, dto *models.DeletePositionDTO) error
}

func (r *PositionRepo) Get(ctx context.Context, req *models.GetPositionsDTO) ([]*models.Position, error) {
	query := fmt.Sprintf(`SELECT id, title, amount, type, count, info FROM %s WHERE order_id=$1 ORDER BY count`, PositionTable)
	data := []*models.Position{}

	if err := r.db.SelectContext(ctx, &data, query, req.OrderId); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *PositionRepo) GetById(ctx context.Context, id string) (*models.PositionDTO, error) {
	query := fmt.Sprintf(`SELECT id, title, amount, type, count, info FROM %s WHERE id=$1`, PositionTable)
	data := &models.PositionDTO{}

	if err := r.db.GetContext(ctx, &data, query, id); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, base.ErrNoRows
		}
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *PositionRepo) GetIdByTitle(ctx context.Context, req *models.GetPositionByTitle) (string, error) {
	query := fmt.Sprintf(`SELECT id FROM %s WHERE title=$1 AND order_id=$2`, PositionTable)
	data := ""

	if err := r.db.GetContext(ctx, &data, query, req.Title, req.OrderId); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return "", base.ErrNoRows
		}
		return "", fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *PositionRepo) Copy(ctx context.Context, dto *models.CopyPositionDTO) error {
	amount := dto.Amount
	if amount == "" {
		amount = "amount"
	}

	query := fmt.Sprintf(`INSERT INTO "%s"(id, order_id, title, amount, type, info, count)
		SELECT $1, $2, title, %s, type, info, $3 FROM %s WHERE id=$4`,
		PositionTable, amount, PositionTable,
	)
	dto.NewId = uuid.NewString()

	_, err := r.db.ExecContext(ctx, query, dto.NewId, dto.OrderId, dto.Count, dto.Id)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *PositionRepo) Create(ctx context.Context, dto *models.PositionDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s (id, order_id, title, amount, type, count, info) VALUES ($1, $2, $3, $4, $5, $6, $7)`, PositionTable)
	dto.Id = uuid.NewString()

	_, err := r.db.ExecContext(ctx, query, dto.Id, dto.OrderId, dto.Title, dto.Amount, dto.Type, dto.Count, dto.Info)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *PositionRepo) CreateSeveral(ctx context.Context, dto []*models.PositionDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s (id, order_id, title, amount, type, count, info) 
		VALUES (:id, :order_id, :title, :amount, :type, :count, :info)`,
		PositionTable,
	)
	for i := range dto {
		dto[i].Id = uuid.NewString()
	}

	_, err := r.db.NamedExecContext(ctx, query, dto)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *PositionRepo) Update(ctx context.Context, dto *models.PositionDTO) error {
	query := fmt.Sprintf(`UPDATE %s SET title=$1, amount=$2, info=$3 WHERE id=$4`, PositionTable)

	_, err := r.db.Exec(query, dto.Title, dto.Amount, dto.Info, dto.Id)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *PositionRepo) Delete(ctx context.Context, dto *models.DeletePositionDTO) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE id=$1`, PositionTable)

	_, err := r.db.ExecContext(ctx, query, dto.Id)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

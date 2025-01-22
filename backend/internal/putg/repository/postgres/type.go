package postgres

import (
	"context"
	"fmt"
	"math"

	"github.com/Alexander272/new-sealur-pro/internal/putg/models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type TypeRepo struct {
	db *sqlx.DB
}

func NewTypeRepo(db *sqlx.DB) *TypeRepo {
	return &TypeRepo{db: db}
}

type PutgType interface {
	Get(ctx context.Context, req *models.GetTypeDTO) ([]*models.PutgType, error)
	Create(ctx context.Context, dto *models.PutgTypeDTO) error
	Update(ctx context.Context, dto *models.PutgTypeDTO) error
	Delete(ctx context.Context, dto *models.DeleteTypeDTO) error
}

func (r *TypeRepo) Get(ctx context.Context, req *models.GetTypeDTO) ([]*models.PutgType, error) {
	data := []*models.PutgType{}
	query := fmt.Sprintf(`SELECT id, title, code, min_thickness, max_thickness, description, type_code FROM %s 
		WHERE filler_id=$1 ORDER BY code`, PutgTypeTable,
	)

	if err := r.db.SelectContext(ctx, &data, query, req.BaseId); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}

	for i := range data {
		data[i].MinThickness = math.Round(data[i].MinThickness*1000) / 1000
		data[i].MaxThickness = math.Round(data[i].MaxThickness*1000) / 1000
	}
	return data, nil
}

func (r *TypeRepo) Create(ctx context.Context, dto *models.PutgTypeDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, title, code, filler_id, min_thickness, max_thickness, description, type_code) 
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
		PutgTypeTable,
	)
	id := uuid.New()

	_, err := r.db.ExecContext(ctx, query, id, dto.Title, dto.Code, dto.FillerId, dto.MinThickness, dto.MaxThickness, dto.Description, dto.TypeCode)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *TypeRepo) Update(ctx context.Context, dto *models.PutgTypeDTO) error {
	query := fmt.Sprintf(`UPDATE %s SET title=$1, code=$2, filler_id=$3, min_thickness=$4, max_thickness=$5, description=$6, 
		type_code=$7 WHERE id=$8`,
		PutgTypeTable,
	)

	_, err := r.db.ExecContext(ctx, query, dto.Title, dto.Code, dto.FillerId, dto.MinThickness, dto.MaxThickness,
		dto.Description, dto.TypeCode, dto.Id,
	)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *TypeRepo) Delete(ctx context.Context, dto *models.DeleteTypeDTO) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE id=$1`, PutgTypeTable)

	_, err := r.db.ExecContext(ctx, query, dto.Id)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

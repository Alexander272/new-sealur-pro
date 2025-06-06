package postgres

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/jacketed/models"
	"github.com/Alexander272/new-sealur-pro/internal/jacketed/repository/postgres/pq_models"
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
	Get(ctx context.Context, req *models.GetMaterialsDTO) (*models.Materials, error)
	Create(ctx context.Context, dto *models.MaterialDTO) error
	Update(ctx context.Context, dto *models.MaterialDTO) error
	Delete(ctx context.Context, dto *models.DeleteMaterialDTO) error
}

func (r *MaterialRepo) Get(ctx context.Context, req *models.GetMaterialsDTO) (*models.Materials, error) {
	query := fmt.Sprintf(`SELECT pm.id, material_id, type, is_default, pm.code, m.code as base_code, title, short_en, thickness
		FROM %s AS pm INNER JOIN %s AS m ON material_id=m.id WHERE standard_id=$1 ORDER BY type, count`,
		JacketedMaterialTable, MaterialTable,
	)
	data := []*pq_models.Material{}

	if err := r.db.SelectContext(ctx, &data, query, req.StandardId); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}

	var shell []*models.Material
	var shellDefIndex int

	for _, m := range data {
		currentMaterial := &models.Material{
			Id:         m.Id,
			MaterialId: m.MaterialId,
			Type:       m.Type,
			IsDefault:  m.IsDefault,
			Code:       m.Code,
			BaseCode:   m.BaseCode,
			Title:      m.Title,
			Short:      m.Short,
		}

		if m.Type == "shell" {
			shell = append(shell, currentMaterial)
			if m.IsDefault {
				shellDefIndex = len(shell) - 1
			}
		}
	}

	material := &models.Materials{
		Shell:             shell,
		ShellDefaultIndex: shellDefIndex,
	}
	return material, nil
}

func (r *MaterialRepo) Create(ctx context.Context, dto *models.MaterialDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s (id, standard_id, material_id, type, is_default, code, thickness) 
		VALUES (:id, :standard_id, :material_id, :type, :is_default, :code, :thickness)`,
		JacketedMaterialTable,
	)
	dto.Id = uuid.NewString()

	if _, err := r.db.NamedExecContext(ctx, query, dto); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *MaterialRepo) Update(ctx context.Context, dto *models.MaterialDTO) error {
	query := fmt.Sprintf(`UPDATE %s SET material_id=:material_id, type=:type, is_default=:is_default, code=:code
		thickness=:thickness WHERE id=:id`,
		JacketedMaterialTable,
	)

	_, err := r.db.NamedExecContext(ctx, query, dto)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *MaterialRepo) Delete(ctx context.Context, dto *models.DeleteMaterialDTO) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE id=:id`, JacketedMaterialTable)

	if _, err := r.db.NamedExecContext(ctx, query, dto); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

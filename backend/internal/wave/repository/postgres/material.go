package postgres

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/putg/repository/postgres/pg_models"
	"github.com/Alexander272/new-sealur-pro/internal/wave/models"
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
	GetByType(ctx context.Context, req *models.GetMaterialsByTypeDTO) ([]*models.Material, error)
	Create(ctx context.Context, dto *models.MaterialDTO) error
	Update(ctx context.Context, dto *models.MaterialDTO) error
	Delete(ctx context.Context, dto *models.DeleteMaterialDTO) error
}

func (r *MaterialRepo) Get(ctx context.Context, req *models.GetMaterialsDTO) (*models.Materials, error) {
	query := fmt.Sprintf(`SELECT pm.id, material_id, type, is_default, pm.code, m.code as base_code, title, short_en
		FROM %s AS pm INNER JOIN %s AS m ON material_id=m.id ORDER BY type, count`,
		WaveMaterialTable, MaterialTable,
	)
	data := []*pg_models.Material{}

	if err := r.db.SelectContext(ctx, &data, query); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}

	var rotaryPlug, base []*models.Material
	var plugDefIndex, baseDefIndex int

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

		if m.Type == "rotaryPlug" {
			rotaryPlug = append(rotaryPlug, currentMaterial)
			if m.IsDefault {
				plugDefIndex = len(rotaryPlug) - 1
			}
		}
		if m.Type == "base" {
			base = append(base, currentMaterial)
			if m.IsDefault {
				baseDefIndex = len(base) - 1
			}
		}
	}

	material := &models.Materials{
		RotaryPlug:             rotaryPlug,
		Base:                   base,
		RotaryPlugDefaultIndex: plugDefIndex,
		BaseDefaultIndex:       baseDefIndex,
	}
	return material, nil
}

func (r *MaterialRepo) GetByType(ctx context.Context, req *models.GetMaterialsByTypeDTO) ([]*models.Material, error) {
	query := fmt.Sprintf(`SELECT pm.id, material_id, type, is_default, pm.code, m.code as base_code, title
		FROM %s AS pm INNER JOIN %s AS m ON material_id=m.id WHERE type=$1 ORDER BY count`,
		WaveMaterialTable, MaterialTable,
	)
	data := []*pg_models.Material{}

	if err := r.db.SelectContext(ctx, &data, query, req.Type); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}

	materials := make([]*models.Material, len(data))
	for i, m := range data {
		materials[i] = &models.Material{
			Id:         m.Id,
			MaterialId: m.MaterialId,
			Type:       m.Type,
			IsDefault:  m.IsDefault,
			Code:       m.Code,
			BaseCode:   m.BaseCode,
			Title:      m.Title,
		}
	}
	return materials, nil
}

func (r *MaterialRepo) Create(ctx context.Context, dto *models.MaterialDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s (id, material_id, type, is_default, code) 
		VALUES (:id, :material_id, :type, :is_default, :code)`,
		WaveMaterialTable,
	)
	dto.Id = uuid.NewString()

	if _, err := r.db.NamedExecContext(ctx, query, dto); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *MaterialRepo) Update(ctx context.Context, dto *models.MaterialDTO) error {
	query := fmt.Sprintf(`UPDATE %s SET material_id=:material_id, type=:type, is_default=:is_default, code=:code WHERE id=:id`,
		WaveMaterialTable,
	)

	_, err := r.db.NamedExecContext(ctx, query, dto)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *MaterialRepo) Delete(ctx context.Context, dto *models.DeleteMaterialDTO) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE id=:id`, WaveMaterialTable)

	if _, err := r.db.NamedExecContext(ctx, query, dto); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

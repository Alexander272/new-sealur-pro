package postgres

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/putg/models"
	"github.com/Alexander272/new-sealur-pro/internal/putg/repository/postgres/pg_models"
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
	query := fmt.Sprintf(`SELECT pm.id, material_id, type, is_default, pm.code, m.code as base_code, title
		FROM %s AS pm INNER JOIN %s AS m ON material_id=m.id WHERE putg_standard_id=$1 ORDER BY type, count`,
		PutgMaterialTable, MaterialTable,
	)
	data := []*pg_models.Material{}

	if err := r.db.SelectContext(ctx, &data, query, req.StandardId); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}

	var rotaryPlug, innerRing, outerRing []*models.Material
	var plugDefIndex, innerDefIndex, outerDefIndex int

	for _, m := range data {
		currentMaterial := &models.Material{
			Id:         m.Id,
			MaterialId: m.MaterialId,
			Type:       m.Type,
			IsDefault:  m.IsDefault,
			Code:       m.Code,
			BaseCode:   m.BaseCode,
			Title:      m.Title,
		}

		if m.Type == "rotaryPlug" {
			rotaryPlug = append(rotaryPlug, currentMaterial)
			if m.IsDefault {
				plugDefIndex = len(rotaryPlug) - 1
			}
		}
		if m.Type == "innerRing" {
			innerRing = append(innerRing, currentMaterial)
			if m.IsDefault {
				innerDefIndex = len(innerRing) - 1
			}
		}
		if m.Type == "outerRing" {
			outerRing = append(outerRing, currentMaterial)
			if m.IsDefault {
				outerDefIndex = len(outerRing) - 1
			}
		}
	}

	material := &models.Materials{
		RotaryPlug:             rotaryPlug,
		InnerRing:              innerRing,
		OuterRing:              outerRing,
		RotaryPlugDefaultIndex: plugDefIndex,
		InnerRingDefaultIndex:  innerDefIndex,
		OuterRingDefaultIndex:  outerDefIndex,
	}
	return material, nil
}

func (r *MaterialRepo) Create(ctx context.Context, dto *models.MaterialDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s (id, putg_standard_id, material_id, type, is_default, code) VALUES ($1, $2, $3, $4, $5, $6)`,
		PutgMaterialTable,
	)
	dto.Id = uuid.NewString()

	_, err := r.db.ExecContext(ctx, query, dto.Id, dto.StandardId, dto.MaterialId, dto.Type, dto.IsDefault, dto.Code)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *MaterialRepo) Update(ctx context.Context, dto *models.MaterialDTO) error {
	query := fmt.Sprintf(`UPDATE %s SET putg_standard_id=$1, material_id=$2, type=$3, is_default=$4, code=$5 WHERE id=$6`, PutgMaterialTable)

	_, err := r.db.ExecContext(ctx, query, dto.StandardId, dto.MaterialId, dto.Type, dto.IsDefault, dto.Code, dto.Id)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *MaterialRepo) Delete(ctx context.Context, dto *models.DeleteMaterialDTO) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE id=$1`, PutgMaterialTable)

	_, err := r.db.ExecContext(ctx, query, dto.Id)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

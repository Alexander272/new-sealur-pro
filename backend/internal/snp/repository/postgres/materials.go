package postgres

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/snp/models"
	"github.com/Alexander272/new-sealur-pro/internal/snp/repository/postgres/pq_models"
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
	Get(ctx context.Context, req *models.GetMaterialDTO) (*models.Materials, error)
	Create(ctx context.Context, dto *models.MaterialDTO) error
	Update(ctx context.Context, dto *models.MaterialDTO) error
	Delete(ctx context.Context, dto *models.DeleteMaterialDTO) error
}

func (r *MaterialRepo) Get(ctx context.Context, req *models.GetMaterialDTO) (*models.Materials, error) {
	query := fmt.Sprintf(`SELECT %s.id, material_id, type, is_default, %s.code, is_standard, %s.code as base_code, title
		FROM %s INNER JOIN %s ON material_id=%s.id WHERE standard_id=$1 ORDER BY type, count`,
		SnpMaterialTableNew, SnpMaterialTableNew, MaterialTable, SnpMaterialTableNew, MaterialTable, MaterialTable,
	)
	data := []*pq_models.Material{}

	if err := r.db.SelectContext(ctx, &data, query, req.StandardId); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}

	var frame []*models.Material
	var innerRing []*models.Material
	var outerRing []*models.Material
	var frameDefIndex, innerDefIndex, outerDefIndex int

	for _, m := range data {
		currentMaterial := &models.Material{
			Id:         m.Id,
			MaterialId: m.MaterialId,
			Type:       m.Type,
			IsDefault:  m.IsDefault,
			Code:       m.Code,
			IsStandard: m.IsStandard,
			BaseCode:   m.BaseCode,
			Title:      m.Title,
		}

		if m.Type == "fr" {
			frame = append(frame, currentMaterial)
			if m.IsDefault {
				frameDefIndex = len(frame) - 1
			}
		}
		if m.Type == "ir" {
			innerRing = append(innerRing, currentMaterial)
			if m.IsDefault {
				innerDefIndex = len(innerRing) - 1
			}
		}
		if m.Type == "or" {
			outerRing = append(outerRing, currentMaterial)
			if m.IsDefault {
				outerDefIndex = len(outerRing) - 1
			}
		}
	}

	// for i, m := range frame {
	// 	if m.IsDefault {
	// 		frameDefIndex = int64(i)
	// 		break
	// 	}
	// }
	// for i, m := range innerRing {
	// 	if m.IsDefault {
	// 		innerDefIndex = int64(i)
	// 		break
	// 	}
	// }
	// for i, m := range outerRing {
	// 	if m.IsDefault {
	// 		outerDefIndex = int64(i)
	// 		break
	// 	}
	// }

	material := &models.Materials{
		Frame:                 frame,
		InnerRing:             innerRing,
		OuterRing:             outerRing,
		FrameDefaultIndex:     frameDefIndex,
		InnerRingDefaultIndex: innerDefIndex,
		OuterRingDefaultIndex: outerDefIndex,
	}

	return material, nil
}

func (r *MaterialRepo) Create(ctx context.Context, dto *models.MaterialDTO) error {
	query := fmt.Sprintf("INSERT INTO %s (id, standard_id, material_id, type, is_default, code, is_standard) VALUES ($1, $2, $3, $4, $5, $6, $7)",
		SnpMaterialTable,
	)
	id := uuid.New()

	_, err := r.db.ExecContext(ctx, query, id, dto.StandardId, dto.MaterialId, dto.Type, dto.IsDefault, dto.Code, dto.IsStandard)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *MaterialRepo) Update(ctx context.Context, dto *models.MaterialDTO) error {
	query := fmt.Sprintf("UPDATE %s	SET standard_id=$1, material_id=$2, type=$3, is_default=$4, code=$5, is_standard=$6 WHERE id=$7", SnpMaterialTable)

	_, err := r.db.ExecContext(ctx, query, dto.StandardId, dto.MaterialId, dto.Type, dto.IsDefault, dto.Code, dto.IsStandard, dto.Id)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *MaterialRepo) Delete(ctx context.Context, dto *models.DeleteMaterialDTO) error {
	query := fmt.Sprintf("DELETE FROM %s WHERE id=$1", SnpMaterialTable)

	if _, err := r.db.ExecContext(ctx, query, dto.Id); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

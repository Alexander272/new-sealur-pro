package postgres

import (
	"context"
	"fmt"
	"strconv"
	"strings"

	"github.com/Alexander272/new-sealur-pro/internal/putg/models"
	"github.com/Alexander272/new-sealur-pro/internal/putg/repository/postgres/pg_models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type ConstructionRepo struct {
	db *sqlx.DB
}

func NewConstructionRepo(db *sqlx.DB) *ConstructionRepo {
	return &ConstructionRepo{db: db}
}

type Construction interface {
	Get(ctx context.Context, req *models.GetConstructionDTO) ([]*models.Construction, error)
	Create(ctx context.Context, dto *models.ConstructionDTO) error
	Update(ctx context.Context, dto *models.ConstructionDTO) error
	Delete(ctx context.Context, dto *models.DeleteConstructionDTO) error
}

func (r *ConstructionRepo) Get(ctx context.Context, req *models.GetConstructionDTO) ([]*models.Construction, error) {
	query := fmt.Sprintf(`SELECT c.id, construction_id, title, code, has_d4, has_d3, has_d2, has_d1, has_rotary_plug, has_inner_ring, has_outer_ring, 
		description, min_width, jumper_width_range, width_range, min_size
	 	FROM %s AS c 
		INNER JOIN %s AS bc ON construction_id=bc.id 
		WHERE putg_flange_type_id=$1 AND filler_id=$2 ORDER BY code`,
		PutgConstructionTable, PutgConstructionBaseTable,
	)
	data := []*pg_models.Construction{}

	if err := r.db.SelectContext(ctx, &data, query, req.FlangeTypeId, req.FillerId); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}

	constructions := []*models.Construction{}
	for _, c := range data {
		widthRange := make([]*models.WidthRange, 0)

		for _, v := range c.WidthRange {
			parts := strings.Split(v, "->")

			max, err := strconv.ParseFloat(parts[0], 64)
			if err != nil {
				return nil, fmt.Errorf("failed to parse max. error: %w", err)
			}
			width, err := strconv.ParseFloat(parts[1], 64)
			if err != nil {
				return nil, fmt.Errorf("failed to parse width. error: %w", err)
			}

			widthRange = append(widthRange, &models.WidthRange{
				MaxD3: max,
				Width: width,
			})
		}

		constructions = append(constructions, &models.Construction{
			Id:            c.Id,
			BaseId:        c.ConstructionId,
			Title:         c.Title,
			Code:          c.Code,
			HasD4:         c.HasD4,
			HasD3:         c.HasD3,
			HasD2:         c.HasD2,
			HasD1:         c.HasD1,
			HasRotaryPlug: c.HasRotaryPlug,
			HasInnerRing:  c.HasInnerRing,
			HasOuterRing:  c.HasOuterRing,
			Description:   c.Description,
			MinWidth:      c.MinWidth,
			JumperRange:   c.JumperWidthRange,
			WidthRange:    widthRange,
			MinSize:       c.MinSize,
		})
	}

	return constructions, nil
}

func (r *ConstructionRepo) Create(ctx context.Context, dto *models.ConstructionDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s (id, construction_id, putg_flange_type_id, filler_id)
		VALUES ($1, $2, $3, $4)`, PutgConstructionTable,
	)
	dto.Id = uuid.NewString()

	_, err := r.db.ExecContext(ctx, query, dto.Id, dto.ConstructionId, dto.FlangeTypeId, dto.FillerId)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *ConstructionRepo) Update(ctx context.Context, dto *models.ConstructionDTO) error {
	query := fmt.Sprintf(`UPDATE %s SET construction_id=$1, filler_id=$2, putg_flange_type_id=$3 WHERE id=$4`,
		PutgConstructionTable,
	)

	_, err := r.db.ExecContext(ctx, query, dto.ConstructionId, dto.FillerId, dto.FlangeTypeId, dto.Id)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *ConstructionRepo) Delete(ctx context.Context, dto *models.DeleteConstructionDTO) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE id=$1`, PutgConstructionTable)

	_, err := r.db.ExecContext(ctx, query, dto.Id)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

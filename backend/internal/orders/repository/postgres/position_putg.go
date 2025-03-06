package postgres

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"strings"

	base "github.com/Alexander272/new-sealur-pro/internal/models"
	"github.com/Alexander272/new-sealur-pro/internal/orders/models"
	"github.com/Alexander272/new-sealur-pro/internal/orders/repository/postgres/pq_models"
	putg_models "github.com/Alexander272/new-sealur-pro/internal/putg/models"
	"github.com/Alexander272/new-sealur-pro/pkg/logger"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type PositionPutgRepo struct {
	db *sqlx.DB
}

func NewPositionPutgRepo(db *sqlx.DB) *PositionPutgRepo {
	return &PositionPutgRepo{db: db}
}

type PositionPutg interface {
	GetByPosition(ctx context.Context, positionId string) (*models.PositionPutg, error)
	Create(ctx context.Context, dto *models.PositionPutgDTO) error
	CreateSeveral(ctx context.Context, dto []*models.PositionPutgDTO) error
	Update(ctx context.Context, dto *models.PositionPutgDTO) error
	Copy(ctx context.Context, dto *models.CopyPositionDTO) error
	CopySeveral(ctx context.Context, dto []*models.CopyPositionDTO) error
}

func (r *PositionPutgRepo) GetByPosition(ctx context.Context, positionId string) (*models.PositionPutg, error) {
	query := fmt.Sprintf(`SELECT id, position_id, putg_standard_id, flange_type_id, configuration_id, size_id, pn_index, h,
		COALESCE(s.d4, ps.d4) AS d4, COALESCE(s.d3, ps.d3) AS d3, COALESCE(s.d2, ps.d2) AS d2, COALESCE(s.d1, ps.d1) AS d1, 
		COALESCE(dn, '') AS dn, COALESCE(dn_mm, '') AS dn_mm, COALESCE(pn_mpa[pn_index+1], '') AS pn_mpa, COALESCE(pn_kg[pn_index+1], '') AS pn_kg,
		has_rounding, filler_id, type_id, construction_id, rotary_plug_id, inner_ring_id, outer_ring_id, 
		jumper, jumper_width, mounting, has_hole, has_coating, has_removable, drawing
		FROM %s AS ps
		LEFT JOIN LATERAL (SELECT dn, dn_mm, pn_mpa, pn_kg, d4, d3, d2, d1 FROM %s WHERE id=ps.size_id) AS s ON true 
		WHERE position_id=$1`,
		PositionPutgTable, PutgSizeTable,
	)
	tmp := &pq_models.PositionPutg{}

	err := r.db.GetContext(ctx, tmp, query, positionId)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, base.ErrNoRows
		}
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}

	data := &models.PositionPutg{
		Main: &models.PositionPutg_Main{
			Standard:      &putg_models.StandardInfo{Id: tmp.PutgStandardId},
			FlangeType:    &putg_models.FlangeType{Id: tmp.FlangeTypeId},
			Configuration: &putg_models.Configuration{Id: tmp.ConfigurationId},
		},
		Size: &models.PositionPutg_Size{
			Id:          tmp.SizeId,
			PnIndex:     tmp.PnIndex,
			Dn:          tmp.Dn,
			DnMm:        tmp.DnMm,
			Pn:          &putg_models.Pn{Mpa: tmp.PnMpa, Kg: tmp.PnKg},
			D4:          tmp.D4,
			D3:          tmp.D3,
			D2:          tmp.D2,
			D1:          tmp.D1,
			H:           tmp.H,
			HasRounding: tmp.HasRounding,
		},
		Material: &models.PositionPutg_Material{
			Filler:       &putg_models.Filler{Id: tmp.FillerId},
			PutgType:     &putg_models.PutgType{Id: tmp.TypeId},
			Construction: &putg_models.Construction{Id: tmp.ConstructionId},
			RotaryPlug:   &putg_models.Material{Id: tmp.RotaryPlugId},
			InnerRing:    &putg_models.Material{Id: tmp.InnerRingId},
			OuterRing:    &putg_models.Material{Id: tmp.OuterRingId},
		},
		Design: &models.PositionPutg_Design{
			Jumper: &models.PositionPutg_Design_Jumper{
				HasJumper: tmp.Jumper != "",
				Code:      tmp.Jumper,
				Width:     tmp.JumperWidth,
			},
			// Mounting: &models.PositionPutg_Design_Mounting{
			// 	HasMounting: tmp.Mounting != "",
			// 	Code:        tmp.Mounting,
			// },
			HasHole:      tmp.HasHole,
			HasCoating:   tmp.HasCoating,
			HasRemovable: tmp.HasRemovable,
			Drawing:      tmp.Drawing,
		},
	}

	return data, nil
}

func (r *PositionPutgRepo) Create(ctx context.Context, dto *models.PositionPutgDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s (id, position_id, putg_standard_id, flange_type_id, configuration_id, size_id, pn_index, 
		d4, d3, d2, d1, h, has_rounding, filler_id, type_id, construction_id, rotary_plug_id, inner_ring_id, outer_ring_id, 
		jumper, jumper_width, mounting, has_hole, has_coating, has_removable, drawing) 
		VALUES(:id, :position_id, :putg_standard_id, :flange_type_id, :configuration_id, :size_id, :pn_index, 
		:d4, :d3, :d2, :d1, :h, :has_rounding, :filler_id, :type_id, :construction_id, :rotary_plug_id, :inner_ring_id, :outer_ring_id,
		:jumper, :jumper_width, :mounting, :has_hole, :has_coating, :has_removable, :drawing)`,
		PositionPutgTable,
	)

	dto.Id = uuid.NewString()
	nilId := uuid.Nil.String()
	if dto.Size.SizeId == "" {
		dto.Size.SizeId = nilId
	}
	if dto.Material.RotaryPlugId == "" {
		dto.Material.RotaryPlugId = nilId
	}
	if dto.Material.InnerRingId == "" {
		dto.Material.InnerRingId = nilId
	}
	if dto.Material.OuterRingId == "" {
		dto.Material.OuterRingId = nilId
	}

	data := &pq_models.PositionPutgDTO{
		Id:              dto.Id,
		PositionId:      dto.PositionId,
		PutgStandardId:  dto.Main.PutgStandardId,
		FlangeTypeId:    dto.Main.FlangeTypeId,
		ConfigurationId: dto.Main.ConfigurationId,
		SizeId:          dto.Size.SizeId,
		PnIndex:         dto.Size.PnIndex,
		D4:              dto.Size.D4,
		D3:              dto.Size.D3,
		D2:              dto.Size.D2,
		D1:              dto.Size.D1,
		H:               dto.Size.H,
		HasRounding:     dto.Size.HasRounding,
		FillerId:        dto.Material.FillerId,
		TypeId:          dto.Material.TypeId,
		ConstructionId:  dto.Material.ConstructionId,
		RotaryPlugId:    dto.Material.RotaryPlugId,
		InnerRingId:     dto.Material.InnerRingId,
		OuterRingId:     dto.Material.OuterRingId,
		Jumper:          dto.Design.Jumper.Code,
		JumperWidth:     dto.Design.Jumper.Width,
		Mounting:        dto.Design.Mounting,
		HasHole:         dto.Design.HasHole,
		HasCoating:      dto.Design.HasCoating,
		HasRemovable:    dto.Design.HasRemovable,
		Drawing:         dto.Design.Drawing,
	}
	logger.Debug("create position putg", logger.AnyAttr("data", data))

	_, err := r.db.NamedExecContext(ctx, query, data)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *PositionPutgRepo) CreateSeveral(ctx context.Context, dto []*models.PositionPutgDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s (id, position_id, putg_standard_id, flange_type_id, configuration_id, size_id, pn_index, 
		d4, d3, d2, d1, h, has_rounding, filler_id, type_id, construction_id, rotary_plug_id, inner_ring_id, outer_ring_id, 
		jumper, jumper_width, mounting, has_hole, has_coating, has_removable, drawing) 
		VALUES(:id, :position_id, :putg_standard_id, :flange_type_id, :configuration_id, :size_id, :pn_index, 
		:d4, :d3, :d2, :d1, :h, :has_rounding, :filler_id, :type_id, :construction_id, :rotary_plug_id, :inner_ring_id, :outer_ring_id,
		:jumper, :jumper_width, :mounting, :has_hole, :has_coating, :has_removable, :drawing)`,
		PositionPutgTable,
	)
	data := []*pq_models.PositionPutgDTO{}

	for i, d := range dto {
		dto[i].Id = uuid.NewString()
		nilId := uuid.Nil.String()
		if dto[i].Size.SizeId == "" {
			dto[i].Size.SizeId = nilId
		}
		if dto[i].Material.RotaryPlugId == "" {
			dto[i].Material.RotaryPlugId = nilId
		}
		if dto[i].Material.InnerRingId == "" {
			dto[i].Material.InnerRingId = nilId
		}
		if dto[i].Material.OuterRingId == "" {
			dto[i].Material.OuterRingId = nilId
		}

		data = append(data, &pq_models.PositionPutgDTO{
			Id:              d.Id,
			PositionId:      d.PositionId,
			PutgStandardId:  d.Main.PutgStandardId,
			FlangeTypeId:    d.Main.FlangeTypeId,
			ConfigurationId: d.Main.ConfigurationId,
			SizeId:          d.Size.SizeId,
			PnIndex:         d.Size.PnIndex,
			D4:              d.Size.D4,
			D3:              d.Size.D3,
			D2:              d.Size.D2,
			D1:              d.Size.D1,
			H:               d.Size.H,
			HasRounding:     d.Size.HasRounding,
			FillerId:        d.Material.FillerId,
			TypeId:          d.Material.TypeId,
			ConstructionId:  d.Material.ConstructionId,
			RotaryPlugId:    d.Material.RotaryPlugId,
			InnerRingId:     d.Material.InnerRingId,
			OuterRingId:     d.Material.OuterRingId,
			Jumper:          d.Design.Jumper.Code,
			JumperWidth:     d.Design.Jumper.Width,
			Mounting:        d.Design.Mounting,
			HasHole:         d.Design.HasHole,
			HasCoating:      d.Design.HasCoating,
			HasRemovable:    d.Design.HasRemovable,
			Drawing:         d.Design.Drawing,
		})
	}

	_, err := r.db.NamedExecContext(ctx, query, data)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *PositionPutgRepo) Update(ctx context.Context, dto *models.PositionPutgDTO) error {
	query := fmt.Sprintf(`UPDATE %s SET putg_standard_id=:putg_standard_id, flange_type_id=:flange_type_id, configuration_id=:configuration_id, 
		size_id=:size_id, pn_index=:pn_index, d4=:d4, d3=:d3, d2=:d2, d1=:d1, h=:h, has_rounding=:has_rounding, 
		filler_id=:filler_id, type_id=:type_id, construction_id=:construction_id, rotary_plug_id=:rotary_plug_id, 
		inner_ring_id=:inner_ring_id, outer_ring_id=:outer_ring_id, jumper=:jumper, jumper_width=:jumper_width, 
		mounting=:mounting, has_hole=:has_hole, has_coating=:has_coating, has_removable=:has_removable, drawing=:drawing 
		WHERE position_id=:position_id`, PositionPutgTable,
	)

	dto.Id = uuid.NewString()
	nilId := uuid.Nil.String()
	if dto.Size.SizeId == "" {
		dto.Size.SizeId = nilId
	}
	if dto.Material.RotaryPlugId == "" {
		dto.Material.RotaryPlugId = nilId
	}
	if dto.Material.InnerRingId == "" {
		dto.Material.InnerRingId = nilId
	}
	if dto.Material.OuterRingId == "" {
		dto.Material.OuterRingId = nilId
	}

	data := &pq_models.PositionPutgDTO{
		Id:              dto.Id,
		PositionId:      dto.PositionId,
		PutgStandardId:  dto.Main.PutgStandardId,
		FlangeTypeId:    dto.Main.FlangeTypeId,
		ConfigurationId: dto.Main.ConfigurationId,
		SizeId:          dto.Size.SizeId,
		PnIndex:         dto.Size.PnIndex,
		D4:              dto.Size.D4,
		D3:              dto.Size.D3,
		D2:              dto.Size.D2,
		D1:              dto.Size.D1,
		H:               dto.Size.H,
		HasRounding:     dto.Size.HasRounding,
		FillerId:        dto.Material.FillerId,
		TypeId:          dto.Material.TypeId,
		ConstructionId:  dto.Material.ConstructionId,
		RotaryPlugId:    dto.Material.RotaryPlugId,
		InnerRingId:     dto.Material.InnerRingId,
		OuterRingId:     dto.Material.OuterRingId,
		Jumper:          dto.Design.Jumper.Code,
		JumperWidth:     dto.Design.Jumper.Width,
		Mounting:        dto.Design.Mounting,
		HasHole:         dto.Design.HasHole,
		HasCoating:      dto.Design.HasCoating,
		HasRemovable:    dto.Design.HasRemovable,
		Drawing:         dto.Design.Drawing,
	}

	_, err := r.db.NamedExecContext(ctx, query, data)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *PositionPutgRepo) Copy(ctx context.Context, dto *models.CopyPositionDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s (id, position_id, putg_standard_id, flange_type_id, configuration_id, size_id, pn_index, 
		d4, d3, d2, d1, h, has_rounding, filler_id, type_id, construction_id, rotary_plug_id, inner_ring_id, outer_ring_id, 
		jumper, jumper_width, mounting, has_hole, has_coating, has_removable, drawing)
		SELECT $1, $2, putg_standard_id, flange_type_id, configuration_id, size_id, pn_index, 
		d4, d3, d2, d1, h, has_rounding, filler_id, type_id, construction_id, rotary_plug_id, inner_ring_id, outer_ring_id, 
		jumper, jumper_width, mounting, has_hole, has_coating, has_removable, drawing FROM %s WHERE position_id=$3`,
		PositionPutgTable, PositionPutgTable,
	)
	id := uuid.New()

	_, err := r.db.ExecContext(ctx, query, id, dto.NewId, dto.Id)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *PositionPutgRepo) CopySeveral(ctx context.Context, dto []*models.CopyPositionDTO) error {
	values := []string{}
	args := []interface{}{}
	for i, v := range dto {
		tmp := []interface{}{uuid.New(), v.NewId, v.Id}
		args = append(args, tmp...)
		numbers := []string{}
		for j := range tmp {
			numbers = append(numbers, fmt.Sprintf("$%d", i*len(tmp)+j+1))
		}
		values = append(values, fmt.Sprintf("(%s)", strings.Join(numbers, ",")))
	}

	query := fmt.Sprintf(`INSERT INTO %s (id, position_id, putg_standard_id, flange_type_id, configuration_id, size_id, pn_index, 
		d4, d3, d2, d1, h, has_rounding, filler_id, type_id, construction_id, rotary_plug_id, inner_ring_id, outer_ring_id, 
		jumper, jumper_width, mounting, has_hole, has_coating, has_removable, drawing)
		SELECT id::uuid, position_id::uuid, putg_standard_id::uuid, flange_type_id::uuid, configuration_id::uuid, size_id::uuid, 
			pn_index::integer, d4, d3, d2, d1, h, has_rounding, filler_id::uuid, type_id::uuid, construction_id::uuid, 
			rotary_plug_id::uuid, inner_ring_id::uuid, outer_ring_id::uuid, jumper, jumper_width, mounting, has_hole, 
			has_coating, has_removable, drawing FROM (VALUES %s) AS s(id, position_id, orig_id)
		LEFT JOIN LATERAL (SELECT putg_standard_id, flange_type_id, configuration_id, size_id, pn_index, 
			d4, d3, d2, d1, h, has_rounding, filler_id, type_id, construction_id, rotary_plug_id, inner_ring_id, 
			outer_ring_id, jumper, jumper_width, mounting, has_hole, has_coating, has_removable, drawing FROM %s
			WHERE position_id=s.orig_id::uuid) AS m ON true`,
		PositionPutgTable, strings.Join(values, ","), PositionPutgTable,
	)

	if _, err := r.db.ExecContext(ctx, query, args...); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

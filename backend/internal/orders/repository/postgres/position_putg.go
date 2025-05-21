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
	Get(ctx context.Context, req *models.GetPositionsDTO) ([]*models.Position, error)
	GetByPosition(ctx context.Context, positionId string) (*models.PositionPutg, error)
	Create(ctx context.Context, dto *models.PositionPutgDTO) error
	CreateSeveral(ctx context.Context, dto []*models.PositionPutgDTO) error
	Update(ctx context.Context, dto *models.PositionPutgDTO) error
	Copy(ctx context.Context, dto *models.CopyPositionDTO) (string, error)
	CopySeveral(ctx context.Context, dto []*models.CopyPositionDTO) error
}

func (r *PositionPutgRepo) Get(ctx context.Context, req *models.GetPositionsDTO) ([]*models.Position, error) {
	query := fmt.Sprintf(`SELECT p.id, title, amount, type, count, info,
		configuration_id, configuration_code, filler_code, type_code, construction_code, 
		rotary_plug_id, inner_ring_id, outer_ring_id, m.arr_mat_code,
		COALESCE(s.d4, ps.d4) AS d4, COALESCE(s.d3, ps.d3) AS d3, COALESCE(s.d2, ps.d2) AS d2, COALESCE(s.d1, ps.d1) AS d1, h, use_dimensions,
		jumper, jumper_width, mounting, has_hole, has_coating, has_removable, drawing
		FROM %s AS p INNER JOIN %s AS ps ON p.id=ps.position_id
		LEFT JOIN LATERAL (SELECT code AS configuration_code FROM %s WHERE id=ps.configuration_id) AS c ON true
		LEFT JOIN LATERAL (SELECT code AS construction_code FROM %s AS c INNER JOIN %s AS b ON construction_id=b.id 
			WHERE c.id=ps.construction_id) AS con ON true
		LEFT JOIN LATERAL (SELECT code AS filler_code FROM %s AS f INNER JOIN %s AS b ON base_filler_id=b.id
			WHERE f.id=ps.filler_id) AS f ON true
		LEFT JOIN LATERAL (SELECT code AS type_code FROM %s WHERE id=ps.type_id) AS t ON true
		LEFT JOIN LATERAL (SELECT dn, dn_alt, pn, pn_alt, d4, d3, d2, d1 FROM %s WHERE id=ps.size_id) AS s ON true
		LEFT JOIN LATERAL (SELECT COALESCE(ARRAY_AGG(m.code ORDER BY array_position(array['rotaryPlug','innerRing','outerRing'], type)),'{}') AS arr_mat_code 
			FROM %s AS sm INNER JOIN %s AS m ON material_id=m.id
			WHERE sm.id=ANY(ARRAY[ps.rotary_plug_id, ps.inner_ring_id, ps.outer_ring_id])
		) AS m ON true
		WHERE order_id=$1 AND type=$2 ORDER BY configuration_code DESC, length(construction_code), count`,
		PositionTable, PositionPutgTable, PutgConfigurationTable, PutgConstructionTable, BaseConstructionTable, PutgFillerTable, BaseFillerTable,
		PutgTypeTable, PutgSizeTable, PutgMaterialTable, MaterialTable,
	)
	tmp := []*pq_models.BasePositionPutg{}

	if err := r.db.SelectContext(ctx, &tmp, query, req.OrderId, models.PositionTypePutg); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}

	data := []*models.Position{}
	for _, d := range tmp {
		rotary := &putg_models.Material{}
		outerRing := &putg_models.Material{}
		innerRing := &putg_models.Material{}
		if d.RotaryPlugId != uuid.Nil.String() {
			rotary = &putg_models.Material{Code: d.ArrMaterials[0]}
		}
		if d.OuterRingId != uuid.Nil.String() {
			outerRing = &putg_models.Material{
				Id:   d.OuterRingId,
				Code: d.ArrMaterials[len(d.ArrMaterials)-1],
			}
		}
		if d.InnerRingId != uuid.Nil.String() {
			innerRing = &putg_models.Material{
				Id:   d.InnerRingId,
				Code: d.ArrMaterials[1],
			}
		}

		data = append(data, &models.Position{
			Id:     d.Id,
			Count:  d.Count,
			Title:  d.Title,
			Amount: d.Amount,
			Info:   d.Info,
			Type:   models.PositionType(d.Type),
			PutgData: &models.PositionPutg{
				Main: &models.PositionPutg_Main{
					Configuration: &putg_models.Configuration{Code: d.ConfigurationCode},
				},
				Size: &models.PositionPutg_Size{
					D4:            d.D4,
					D3:            d.D3,
					D2:            d.D2,
					D1:            d.D1,
					H:             d.H,
					UseDimensions: d.UseDimensions,
					HasRounding:   d.HasRounding,
				},
				Material: &models.PositionPutg_Material{
					Filler:       &putg_models.Filler{Code: d.FillerCode},
					PutgType:     &putg_models.PutgType{Code: d.TypeCode},
					Construction: &putg_models.Construction{Code: d.ConstructionCode},
					RotaryPlug:   rotary,
					InnerRing:    innerRing,
					OuterRing:    outerRing,
				},
				Design: &models.PositionPutg_Design{
					Jumper: &models.PositionPutg_Design_Jumper{
						HasJumper: d.Jumper != "",
						Code:      d.Jumper,
						Width:     d.JumperWidth,
					},
					HasHole:      d.HasHole,
					HasCoating:   d.HasCoating,
					HasRemovable: d.HasRemovable,
					Drawing:      d.Drawing,
				},
			},
		})
	}
	return data, nil
}

func (r *PositionPutgRepo) GetByPosition(ctx context.Context, positionId string) (*models.PositionPutg, error) {
	query := fmt.Sprintf(`SELECT id, position_id, putg_standard_id, flange_type_id, configuration_id, size_id, h,
		COALESCE(s.d4, ps.d4) AS d4, COALESCE(s.d3, ps.d3) AS d3, COALESCE(s.d2, ps.d2) AS d2, COALESCE(s.d1, ps.d1) AS d1, 
		COALESCE(dn, '') AS dn, COALESCE(dn_alt, 0) AS dn_alt, COALESCE(pn, '') AS pn, COALESCE(pn_alt, '') AS pn_alt,
		has_rounding, use_dimensions, filler_id, type_id, construction_id, rotary_plug_id, inner_ring_id, outer_ring_id, 
		jumper, jumper_width, mounting, has_hole, has_coating, has_removable, drawing
		FROM %s AS ps
		LEFT JOIN LATERAL (SELECT dn, dn_alt, pn, pn_alt, d4, d3, d2, d1 FROM %s WHERE id=ps.size_id) AS s ON true 
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

	sizeId := ""
	if tmp.SizeId != uuid.Nil.String() {
		sizeId = tmp.SizeId
	}

	data := &models.PositionPutg{
		Main: &models.PositionPutg_Main{
			Standard:      &putg_models.StandardInfo{Id: tmp.PutgStandardId},
			FlangeType:    &putg_models.FlangeType{Id: tmp.FlangeTypeId},
			Configuration: &putg_models.Configuration{Id: tmp.ConfigurationId},
		},
		Size: &models.PositionPutg_Size{
			Id:            sizeId,
			Dn:            tmp.Dn,
			DnAlt:         tmp.DnAlt,
			Pn:            tmp.Pn,
			PnAlt:         tmp.PnAlt,
			D4:            tmp.D4,
			D3:            tmp.D3,
			D2:            tmp.D2,
			D1:            tmp.D1,
			H:             tmp.H,
			UseDimensions: tmp.UseDimensions,
			HasRounding:   tmp.HasRounding,
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
	query := fmt.Sprintf(`INSERT INTO %s (id, position_id, putg_standard_id, flange_type_id, configuration_id, size_id,
		d4, d3, d2, d1, h, has_rounding, use_dimensions, filler_id, type_id, construction_id, rotary_plug_id, inner_ring_id, outer_ring_id, 
		jumper, jumper_width, mounting, has_hole, has_coating, has_removable, drawing) 
		VALUES(:id, :position_id, :putg_standard_id, :flange_type_id, :configuration_id, :size_id,
		:d4, :d3, :d2, :d1, :h, :has_rounding, :use_dimensions, :filler_id, :type_id, :construction_id, :rotary_plug_id, :inner_ring_id, :outer_ring_id,
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
		D4:              dto.Size.D4,
		D3:              dto.Size.D3,
		D2:              dto.Size.D2,
		D1:              dto.Size.D1,
		H:               dto.Size.H,
		HasRounding:     dto.Size.HasRounding,
		UseDimensions:   dto.Size.UseDimensions,
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

func (r *PositionPutgRepo) CreateSeveral(ctx context.Context, dto []*models.PositionPutgDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s (id, position_id, putg_standard_id, flange_type_id, configuration_id, size_id, 
		d4, d3, d2, d1, h, has_rounding, use_dimensions, filler_id, type_id, construction_id, rotary_plug_id, inner_ring_id, outer_ring_id, 
		jumper, jumper_width, mounting, has_hole, has_coating, has_removable, drawing) 
		VALUES(:id, :position_id, :putg_standard_id, :flange_type_id, :configuration_id, :size_id,
		:d4, :d3, :d2, :d1, :h, :has_rounding, :use_dimensions, :filler_id, :type_id, :construction_id, :rotary_plug_id, :inner_ring_id,
		:outer_ring_id, :jumper, :jumper_width, :mounting, :has_hole, :has_coating, :has_removable, :drawing)`,
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
			D4:              d.Size.D4,
			D3:              d.Size.D3,
			D2:              d.Size.D2,
			D1:              d.Size.D1,
			H:               d.Size.H,
			HasRounding:     d.Size.HasRounding,
			UseDimensions:   d.Size.UseDimensions,
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
		size_id=:size_id, d4=:d4, d3=:d3, d2=:d2, d1=:d1, h=:h, has_rounding=:has_rounding, use_dimensions=:use_dimensions,
		filler_id=:filler_id, type_id=:type_id, construction_id=:construction_id, rotary_plug_id=:rotary_plug_id, 
		inner_ring_id=:inner_ring_id, outer_ring_id=:outer_ring_id, jumper=:jumper, jumper_width=:jumper_width, 
		mounting=:mounting, has_hole=:has_hole, has_coating=:has_coating, has_removable=:has_removable, drawing=:drawing 
		WHERE position_id=:position_id`, PositionPutgTable,
	)

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
		D4:              dto.Size.D4,
		D3:              dto.Size.D3,
		D2:              dto.Size.D2,
		D1:              dto.Size.D1,
		H:               dto.Size.H,
		HasRounding:     dto.Size.HasRounding,
		UseDimensions:   dto.Size.UseDimensions,
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

func (r *PositionPutgRepo) Copy(ctx context.Context, dto *models.CopyPositionDTO) (string, error) {
	query := fmt.Sprintf(`INSERT INTO %s (id, position_id, putg_standard_id, flange_type_id, configuration_id, size_id,
		d4, d3, d2, d1, h, has_rounding, use_dimensions, filler_id, type_id, construction_id, rotary_plug_id, inner_ring_id, outer_ring_id, 
		jumper, jumper_width, mounting, has_hole, has_coating, has_removable, drawing)
		SELECT $1, $2, putg_standard_id, flange_type_id, configuration_id, size_id,
		d4, d3, d2, d1, h, has_rounding, use_dimensions, filler_id, type_id, construction_id, rotary_plug_id, inner_ring_id, outer_ring_id, 
		jumper, jumper_width, mounting, has_hole, has_coating, has_removable, replace(drawing, $3, $4) FROM %s 
		WHERE position_id=$5 RETURNING drawing`,
		PositionPutgTable, PositionPutgTable,
	)
	id := uuid.New()

	row := r.db.QueryRowContext(ctx, query, id, dto.NewId, dto.FromOrderId, dto.OrderId, dto.Id)
	if row.Err() != nil {
		return "", fmt.Errorf("failed to execute query. error: %w", row.Err())
	}

	var drawing string
	if err := row.Scan(&drawing); err != nil {
		return "", fmt.Errorf("failed to scan result. error: %w", err)
	}

	// _, err := r.db.ExecContext(ctx, query, id, dto.NewId, dto.Id)
	// if err != nil {
	// 	return fmt.Errorf("failed to execute query. error: %w", err)
	// }
	return drawing, nil
}

func (r *PositionPutgRepo) CopySeveral(ctx context.Context, dto []*models.CopyPositionDTO) error {
	values := []string{}
	args := []interface{}{}
	for i, v := range dto {
		tmp := []interface{}{uuid.New(), v.NewId, v.Id, v.FromOrderId, v.OrderId}
		args = append(args, tmp...)
		numbers := []string{}
		for j := range tmp {
			numbers = append(numbers, fmt.Sprintf("$%d", i*len(tmp)+j+1))
		}
		values = append(values, fmt.Sprintf("(%s)", strings.Join(numbers, ",")))
	}

	query := fmt.Sprintf(`INSERT INTO %s (id, position_id, putg_standard_id, flange_type_id, configuration_id, size_id, 
		d4, d3, d2, d1, h, has_rounding, use_dimensions, filler_id, type_id, construction_id, rotary_plug_id, inner_ring_id, outer_ring_id, 
		jumper, jumper_width, mounting, has_hole, has_coating, has_removable, drawing)
		SELECT id::uuid, position_id::uuid, putg_standard_id::uuid, flange_type_id::uuid, configuration_id::uuid, size_id::uuid, 
			d4, d3, d2, d1, h, has_rounding, use_dimensions, filler_id::uuid, type_id::uuid, construction_id::uuid, 
			rotary_plug_id::uuid, inner_ring_id::uuid, outer_ring_id::uuid, jumper, jumper_width, mounting, has_hole, 
			has_coating, has_removable, drawing FROM (VALUES %s) AS s(id, position_id, orig_id, from_order_id, order_id)
		LEFT JOIN LATERAL (SELECT putg_standard_id, flange_type_id, configuration_id, size_id, 
			d4, d3, d2, d1, h, has_rounding, use_dimensions, filler_id, type_id, construction_id, rotary_plug_id, inner_ring_id, 
			outer_ring_id, jumper, jumper_width, mounting, has_hole, has_coating, has_removable, 
			replace(drawing, s.from_order_id, s.order_id) AS drawing
			FROM %s WHERE position_id=s.orig_id::uuid) AS m ON true`,
		PositionPutgTable, strings.Join(values, ","), PositionPutgTable,
	)

	if _, err := r.db.ExecContext(ctx, query, args...); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

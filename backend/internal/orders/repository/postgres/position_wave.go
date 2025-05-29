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
	wave_models "github.com/Alexander272/new-sealur-pro/internal/wave/models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type PositionWaveRepo struct {
	db *sqlx.DB
}

func NewPositionWaveRepo(db *sqlx.DB) *PositionWaveRepo {
	return &PositionWaveRepo{db: db}
}

type PositionWave interface {
	Get(ctx context.Context, req *models.GetPositionsDTO) ([]*models.Position, error)
	GetByPosition(ctx context.Context, positionId string) (*models.PositionWave, error)
	GetDrawing(ctx context.Context, positionId string) (string, error)
	Create(ctx context.Context, dto *models.PositionWaveDTO) error
	Update(ctx context.Context, dto *models.PositionWaveDTO) error
	Copy(ctx context.Context, dto *models.CopyPositionDTO) (string, error)
	CopySeveral(ctx context.Context, dto []*models.CopyPositionDTO) error
}

func (r *PositionWaveRepo) Get(ctx context.Context, req *models.GetPositionsDTO) ([]*models.Position, error) {
	query := fmt.Sprintf(`SELECT p.id, title, amount, type, count, info,
		configuration_code, type_code, construction_code, plating_code,
		base_id, rotary_plug_id, m.arr_mat_code,
		COALESCE(s.d4, ps.d4) AS d4, COALESCE(s.d3, ps.d3) AS d3, COALESCE(s.d2, ps.d2) AS d2, COALESCE(s.d1, ps.d1) AS d1, h,
		has_rounding, jumper, jumper_width, has_hole, has_coating, with_retainer, drawing
		FROM %s AS p INNER JOIN %s AS ps ON p.id=ps.position_id
		LEFT JOIN LATERAL (SELECT code AS configuration_code FROM %s WHERE id=ps.configuration_id) AS c ON true
		LEFT JOIN LATERAL (SELECT code AS construction_code FROM %s WHERE id=ps.construction_id) AS con ON true
		LEFT JOIN LATERAL (SELECT code AS plating_code FROM %s WHERE id=ps.plating_id) AS pl ON true
		LEFT JOIN LATERAL (SELECT b.code AS type_code FROM %s AS c INNER JOIN %s AS b ON base_id=b.id 
			WHERE c.id=ps.type_id) AS t ON true
		LEFT JOIN LATERAL (SELECT dn, dn_alt, pn, pn_alt, d4, d3, d2, d1 FROM %s WHERE id=ps.size_id) AS s ON true 
		LEFT JOIN LATERAL (SELECT COALESCE(ARRAY_AGG(m.code ORDER BY array_position(array['base','rotaryPlug'], type)),'{}') AS arr_mat_code 
			FROM %s AS sm INNER JOIN %s AS m ON material_id=m.id
			WHERE sm.id=ANY(ARRAY[ps.base_id, ps.rotary_plug_id])
		) AS m ON true
		WHERE order_id=$1 AND type=$2 ORDER BY configuration_code DESC, length(construction_code), count`,
		PositionTable, PositionWaveTable, WaveConfigurationTable, WaveConstructionTable, WavePlatingTable, WaveTypeTable, WaveBaseTypeTable,
		WaveSizeTable, WaveMaterialTable, MaterialTable,
	)
	tmp := []*pq_models.BasePositionWave{}

	if err := r.db.SelectContext(ctx, &tmp, query, req.OrderId, models.PositionTypeWave); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}

	data := []*models.Position{}
	for _, d := range tmp {
		base := &wave_models.Material{}
		rotary := &wave_models.Material{}
		if d.BaseId != uuid.Nil.String() {
			base = &wave_models.Material{Id: d.BaseId, Code: d.ArrMaterials[0]}
		}
		if d.RotaryPlugId != uuid.Nil.String() {
			rotary = &wave_models.Material{Code: d.ArrMaterials[len(d.ArrMaterials)-1]}
		}

		data = append(data, &models.Position{
			Id:     d.Id,
			Count:  d.Count,
			Title:  d.Title,
			Amount: d.Amount,
			Info:   d.Info,
			Type:   models.PositionType(d.Type),
			WaveData: &models.PositionWave{
				Main: &models.PositionWave_Main{
					Configuration: &wave_models.Configuration{Code: d.ConfigurationCode},
					WaveType:      &wave_models.WaveType{Code: d.TypeCode},
					Construction:  &wave_models.Construction{Code: d.ConstructionCode},
				},
				Size: &models.PositionWave_Size{
					D4:          d.D4,
					D3:          d.D3,
					D2:          d.D2,
					D1:          d.D1,
					H:           d.H,
					HasRounding: d.HasRounding,
				},
				Material: &models.PositionWave_Material{
					Plating:    &wave_models.Plating{Code: d.PlatingCode},
					Base:       base,
					RotaryPlug: rotary,
				},
				Design: &models.PositionWave_Design{
					Jumper: &models.PositionWave_Jumper{
						HasJumper: d.Jumper != "",
						Code:      d.Jumper,
						Width:     d.JumperWidth,
					},
					HasHole:      d.HasHole,
					HasCoating:   d.HasCoating,
					WithRetainer: d.WithRetainer,
					Drawing:      d.Drawing,
				},
			},
		})
	}
	return data, nil
}

func (r *PositionWaveRepo) GetByPosition(ctx context.Context, positionId string) (*models.PositionWave, error) {
	query := fmt.Sprintf(`SELECT id, position_id, configuration_id, standard_id, flange_type_id, type_id, construction_id, plating_id, 
		base_id, rotary_plug_id, size_id, COALESCE(s.d4, ps.d4) AS d4, COALESCE(s.d3, ps.d3) AS d3, COALESCE(s.d2, ps.d2) AS d2, 
		COALESCE(s.d1, ps.d1) AS d1, COALESCE(dn, '') AS dn, COALESCE(dn_alt, 0) AS dn_alt, COALESCE(pn, '') AS pn, 
		COALESCE(pn_alt, '') AS pn_alt, h, has_rounding, use_dimensions, jumper, jumper_width, has_hole, has_coating, with_retainer, 
		drawing FROM %s AS ps
		LEFT JOIN LATERAL (SELECT dn, dn_alt, pn, pn_alt, d4, d3, d2, d1 FROM %s WHERE id=ps.size_id) AS s ON true 
		WHERE position_id=$1`,
		PositionWaveTable, WaveSizeTable,
	)
	tmp := &pq_models.PositionWave{}

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

	data := &models.PositionWave{
		Main: &models.PositionWave_Main{
			Configuration: &wave_models.Configuration{Id: tmp.ConfigurationId},
			Standard:      &wave_models.StandardInfo{Id: tmp.StandardId},
			FlangeType:    &wave_models.FlangeType{Id: tmp.FlangeTypeId},
			WaveType:      &wave_models.WaveType{Id: tmp.TypeId},
			Construction:  &wave_models.Construction{Id: tmp.ConstructionId},
		},
		Size: &models.PositionWave_Size{
			Id:          sizeId,
			Dn:          tmp.Dn,
			DnAlt:       tmp.DnAlt,
			Pn:          tmp.Pn,
			PnAlt:       tmp.PnAlt,
			D4:          tmp.D4,
			D3:          tmp.D3,
			D2:          tmp.D2,
			D1:          tmp.D1,
			H:           tmp.H,
			HasRounding: tmp.HasRounding,
		},
		Material: &models.PositionWave_Material{
			Plating:    &wave_models.Plating{Id: tmp.PlatingId},
			Base:       &wave_models.Material{Id: tmp.BaseId},
			RotaryPlug: &wave_models.Material{Id: tmp.RotaryPlugId},
		},
		Design: &models.PositionWave_Design{
			Jumper: &models.PositionWave_Jumper{
				HasJumper: tmp.Jumper != "",
				Code:      tmp.Jumper,
				Width:     tmp.JumperWidth,
			},
			HasHole:      tmp.HasHole,
			HasCoating:   tmp.HasCoating,
			WithRetainer: tmp.WithRetainer,
			Drawing:      tmp.Drawing,
		},
	}
	return data, nil
}

func (r *PositionWaveRepo) GetDrawing(ctx context.Context, positionId string) (string, error) {
	query := fmt.Sprintf(`SELECT id, position_id, drawing FROM %s WHERE position_id=$1`, PositionWaveTable)

	data := &pq_models.PositionSnp{}
	if err := r.db.GetContext(ctx, data, query, positionId); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return "", base.ErrNoRows
		}
		return "", fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data.Drawing, nil
}

func (r *PositionWaveRepo) Create(ctx context.Context, dto *models.PositionWaveDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, position_id, configuration_id, standard_id, flange_type_id, type_id, construction_id, plating_id, 
		base_id, rotary_plug_id, size_id, d4, d3, d2, d1, h, has_rounding, use_dimensions, jumper, jumper_width, has_hole, has_coating, with_retainer, 
		drawing) VALUES (:id, :position_id, :configuration_id, :standard_id, :flange_type_id, :type_id, :construction_id, :plating_id,
		:base_id, :rotary_plug_id, :size_id, :d4, :d3, :d2, :d1, :h, :has_rounding, :use_dimensions, :jumper, :jumper_width, :has_hole,
		:has_coating, :with_retainer, :drawing)`,
		PositionWaveTable,
	)

	dto.Id = uuid.NewString()
	nilId := uuid.Nil.String()
	if dto.Size.Id == "" {
		dto.Size.Id = nilId
	}
	if dto.Material.RotaryPlugId == "" {
		dto.Material.RotaryPlugId = nilId
	}

	data := &pq_models.PositionWaveDTO{
		Id:              dto.Id,
		PositionId:      dto.PositionId,
		ConfigurationId: dto.Main.ConfigurationId,
		StandardId:      dto.Main.StandardId,
		FlangeTypeId:    dto.Main.FlangeTypeId,
		TypeId:          dto.Main.WaveTypeId,
		ConstructionId:  dto.Main.ConstructionId,
		SizeId:          dto.Size.Id,
		D4:              dto.Size.D4,
		D3:              dto.Size.D3,
		D2:              dto.Size.D2,
		D1:              dto.Size.D1,
		H:               dto.Size.H,
		HasRounding:     dto.Size.HasRounding,
		PlatingId:       dto.Material.PlatingId,
		BaseId:          dto.Material.BaseId,
		RotaryPlugId:    dto.Material.RotaryPlugId,
		Jumper:          dto.Design.Jumper.Code,
		JumperWidth:     dto.Design.Jumper.Width,
		HasHole:         dto.Design.HasHole,
		HasCoating:      dto.Design.HasCoating,
		WithRetainer:    dto.Design.WithRetainer,
		Drawing:         dto.Design.Drawing,
	}

	if _, err := r.db.NamedExecContext(ctx, query, data); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *PositionWaveRepo) Update(ctx context.Context, dto *models.PositionWaveDTO) error {
	query := fmt.Sprintf(`UPDATE %s SET configuration_id=:configuration_id, standard_id=:standard_id, flange_type_id=:flange_type_id, type_id=:type_id,
		construction_id=:construction_id, plating_id=:plating_id, base_id=:base_id, rotary_plug_id=:rotary_plug_id, size_id=:size_id, d4=:d4,
		d3=:d3, d2=:d2, d1=:d1, h=:h, has_rounding=:has_rounding, use_dimensions=:use_dimensions, jumper=:jumper, jumper_width=:jumper_width,
		has_hole=:has_hole, has_coating=:has_coating, with_retainer=:with_retainer, drawing=:drawing WHERE position_id=:position_id`,
		PositionWaveTable,
	)

	nilId := uuid.Nil.String()
	if dto.Size.Id == "" {
		dto.Size.Id = nilId
	}
	if dto.Material.RotaryPlugId == "" {
		dto.Material.RotaryPlugId = nilId
	}

	data := &pq_models.PositionWaveDTO{
		Id:              dto.Id,
		PositionId:      dto.PositionId,
		ConfigurationId: dto.Main.ConfigurationId,
		StandardId:      dto.Main.StandardId,
		FlangeTypeId:    dto.Main.FlangeTypeId,
		TypeId:          dto.Main.WaveTypeId,
		ConstructionId:  dto.Main.ConstructionId,
		SizeId:          dto.Size.Id,
		D4:              dto.Size.D4,
		D3:              dto.Size.D3,
		D2:              dto.Size.D2,
		D1:              dto.Size.D1,
		H:               dto.Size.H,
		HasRounding:     dto.Size.HasRounding,
		PlatingId:       dto.Material.PlatingId,
		BaseId:          dto.Material.BaseId,
		RotaryPlugId:    dto.Material.RotaryPlugId,
		Jumper:          dto.Design.Jumper.Code,
		JumperWidth:     dto.Design.Jumper.Width,
		HasHole:         dto.Design.HasHole,
		HasCoating:      dto.Design.HasCoating,
		WithRetainer:    dto.Design.WithRetainer,
		Drawing:         dto.Design.Drawing,
	}

	if _, err := r.db.NamedExecContext(ctx, query, data); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *PositionWaveRepo) Copy(ctx context.Context, dto *models.CopyPositionDTO) (string, error) {
	query := fmt.Sprintf(`INSERT INTO %s(id, position_id, configuration_id, standard_id, flange_type_id, type_id, construction_id, plating_id, 
		base_id, rotary_plug_id, size_id, d4, d3, d2, d1, h, has_rounding, use_dimensions, jumper, jumper_width, has_hole, has_coating, with_retainer, 
		drawing) SELECT $1, $2, configuration_id, standard_id, flange_type_id, type_id, construction_id, plating_id, 
		base_id, rotary_plug_id, size_id, d4, d3, d2, d1, h, has_rounding, use_dimensions, jumper, jumper_width, has_hole, has_coating, with_retainer, 
		replace(drawing, $3, $4) FROM %s WHERE position_id=$5 RETURNING drawing`,
		PositionWaveTable, PositionWaveTable,
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
	return drawing, nil
}

func (r *PositionWaveRepo) CopySeveral(ctx context.Context, dto []*models.CopyPositionDTO) error {
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

	query := fmt.Sprintf(`INSERT INTO %s (id, position_id, configuration_id, standard_id, flange_type_id, type_id, construction_id, plating_id, 
		base_id, rotary_plug_id, size_id, d4, d3, d2, d1, h, has_rounding, use_dimensions, jumper, jumper_width, has_hole, has_coating, with_retainer, 
		drawing)
		SELECT id::uuid, position_id::uuid, configuration_id::uuid, standard_id::uuid, flange_type_id::uuid, plating_id::uuid, 
			base_id::uuid, rotary_plug_id::uuid, size_id::uuid, d4, d3, d2, d1, h, has_rounding, use_dimensions, jumper, jumper_width, has_hole, 
			has_coating, with_retainer, drawing FROM (VALUES %s) AS s(id, position_id, orig_id, from_order_id, order_id)
		LEFT JOIN LATERAL (SELECT configuration_id, standard_id, flange_type_id, type_id, construction_id, plating_id, base_id, 
			rotary_plug_id, size_id, d4, d3, d2, d1, h, has_rounding, use_dimensions, jumper, jumper_width, has_hole, has_coating, 
			with_retainer, replace(drawing, s.from_order_id, s.order_id) AS drawing
			FROM %s WHERE position_id=s.orig_id::uuid) AS m ON true`,
		PositionPutgTable, strings.Join(values, ","), PositionPutgTable,
	)

	if _, err := r.db.ExecContext(ctx, query, args...); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

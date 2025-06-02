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
	serrated_models "github.com/Alexander272/new-sealur-pro/internal/serrated/models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type PositionSerratedRepo struct {
	db *sqlx.DB
}

func NewPositionSerratedRepo(db *sqlx.DB) *PositionSerratedRepo {
	return &PositionSerratedRepo{
		db: db,
	}
}

type PositionSerrated interface {
	Get(ctx context.Context, req *models.GetPositionsDTO) ([]*models.Position, error)
	GetByPosition(ctx context.Context, positionId string) (*models.PositionSerrated, error)
	GetDrawing(ctx context.Context, positionId string) (string, error)
	Create(ctx context.Context, dto *models.PositionSerratedDTO) error
	Update(ctx context.Context, dto *models.PositionSerratedDTO) error
	Copy(ctx context.Context, dto *models.CopyPositionDTO) (string, error)
	CopySeveral(ctx context.Context, dto []*models.CopyPositionDTO) error
}

func (r *PositionSerratedRepo) Get(ctx context.Context, req *models.GetPositionsDTO) ([]*models.Position, error) {
	query := fmt.Sprintf(`SELECT p.id, title, amount, type, count, info,
		type_code, construction_code, plating_code,	base_id, rotary_plug_id, m.arr_mat_code,
		COALESCE(s.d4, ps.d4) AS d4, COALESCE(s.d3, ps.d3) AS d3, COALESCE(s.d2, ps.d2) AS d2, COALESCE(s.d1, ps.d1) AS d1, h,
		jumper, jumper_width, has_hole, has_coating, with_retainer, drawing
		FROM %s AS p INNER JOIN %s AS ps ON p.id=ps.position_id
		LEFT JOIN LATERAL (SELECT code AS construction_code FROM %s WHERE id=ps.construction_id) AS con ON true
		LEFT JOIN LATERAL (SELECT code AS plating_code FROM %s WHERE id=ps.plating_id) AS pl ON true
		LEFT JOIN LATERAL (SELECT b.code AS type_code FROM %s AS c INNER JOIN %s AS b ON base_id=b.id 
			WHERE c.id=ps.type_id) AS t ON true
		LEFT JOIN LATERAL (SELECT dn, dn_alt, pn, pn_alt, d4, d3, d2, d1 FROM %s WHERE id=ps.size_id) AS s ON true 
		LEFT JOIN LATERAL (SELECT COALESCE(ARRAY_AGG(m.code ORDER BY array_position(array['base','rotaryPlug'], type)),'{}') AS arr_mat_code 
			FROM %s AS sm INNER JOIN %s AS m ON material_id=m.id
			WHERE sm.id=ANY(ARRAY[ps.base_id, ps.rotary_plug_id])
		) AS m ON true
		WHERE order_id=$1 AND type=$2 ORDER BY count`,
		PositionTable, PositionSerratedTable, SerratedConstructionTable, SerratedPlatingTable, SerratedTypeTable, SerratedBaseTypeTable,
		SerratedSizeTable, SerratedMaterialTable, MaterialTable,
	)
	tmp := []*pq_models.BasePositionSerrated{}

	if err := r.db.SelectContext(ctx, &tmp, query, req.OrderId, models.PositionTypeSerrated); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}

	data := []*models.Position{}
	for _, d := range tmp {
		base := &serrated_models.Material{}
		rotary := &serrated_models.Material{}
		if d.BaseId != uuid.Nil.String() {
			base = &serrated_models.Material{Id: d.BaseId, Code: d.ArrMaterials[0]}
		}
		if d.RotaryPlugId != uuid.Nil.String() {
			rotary = &serrated_models.Material{Code: d.ArrMaterials[len(d.ArrMaterials)-1]}
		}

		data = append(data, &models.Position{
			Id:     d.Id,
			Count:  d.Count,
			Title:  d.Title,
			Amount: d.Amount,
			Info:   d.Info,
			Type:   models.PositionType(d.Type),
			SerratedData: &models.PositionSerrated{
				Main: &models.PositionSerrated_Main{
					SerratedType: &serrated_models.SerratedType{Code: d.TypeCode},
					Construction: &serrated_models.Construction{Code: d.ConstructionCode},
				},
				Size: &models.PositionSerrated_Size{
					D4: d.D4,
					D3: d.D3,
					D2: d.D2,
					D1: d.D1,
					H:  d.H,
				},
				Material: &models.PositionSerrated_Material{
					Plating:    &serrated_models.Plating{Code: d.PlatingCode},
					Base:       base,
					RotaryPlug: rotary,
				},
				Design: &models.PositionSerrated_Design{
					Jumper: &models.PositionSerrated_Jumper{
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

func (r *PositionSerratedRepo) GetByPosition(ctx context.Context, positionId string) (*models.PositionSerrated, error) {
	query := fmt.Sprintf(`SELECT id, position_id, standard_id, flange_type_id, type_id, construction_id, plating_id, base_id, 
		rotary_plug_id, size_id, COALESCE(s.d4, ps.d4) AS d4, COALESCE(s.d3, ps.d3) AS d3, COALESCE(s.d2, ps.d2) AS d2, 
		COALESCE(s.d1, ps.d1) AS d1, COALESCE(dn, '') AS dn, COALESCE(dn_alt, 0) AS dn_alt, COALESCE(pn, '') AS pn, 
		COALESCE(pn_alt, '') AS pn_alt, h, jumper, jumper_width, has_hole, has_coating, with_retainer, drawing
		FROM %s AS ps
		LEFT JOIN LATERAL (SELECT dn, dn_alt, pn, pn_alt, d4, d3, d2, d1 FROM %s WHERE id=ps.size_id) AS s ON true 
		WHERE position_id=$1`,
		PositionSerratedTable, SerratedSizeTable,
	)
	tmp := &pq_models.PositionSerrated{}

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

	data := &models.PositionSerrated{
		Main: &models.PositionSerrated_Main{
			Standard:     &serrated_models.StandardInfo{Id: tmp.StandardId},
			FlangeType:   &serrated_models.FlangeType{Id: tmp.FlangeTypeId},
			SerratedType: &serrated_models.SerratedType{Id: tmp.TypeId},
			Construction: &serrated_models.Construction{Id: tmp.ConstructionId},
		},
		Size: &models.PositionSerrated_Size{
			Id:    sizeId,
			Dn:    tmp.Dn,
			DnAlt: tmp.DnAlt,
			Pn:    tmp.Pn,
			PnAlt: tmp.PnAlt,
			D4:    tmp.D4,
			D3:    tmp.D3,
			D2:    tmp.D2,
			D1:    tmp.D1,
			H:     tmp.H,
		},
		Material: &models.PositionSerrated_Material{
			Plating:    &serrated_models.Plating{Id: tmp.PlatingId},
			Base:       &serrated_models.Material{Id: tmp.BaseId},
			RotaryPlug: &serrated_models.Material{Id: tmp.RotaryPlugId},
		},
		Design: &models.PositionSerrated_Design{
			Jumper: &models.PositionSerrated_Jumper{
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

func (r *PositionSerratedRepo) GetDrawing(ctx context.Context, positionId string) (string, error) {
	query := fmt.Sprintf(`SELECT id, position_id, drawing FROM %s WHERE position_id=$1`, PositionSerratedTable)

	data := &pq_models.PositionSnp{}
	if err := r.db.GetContext(ctx, data, query, positionId); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return "", base.ErrNoRows
		}
		return "", fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data.Drawing, nil
}

func (r *PositionSerratedRepo) Create(ctx context.Context, dto *models.PositionSerratedDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, position_id, standard_id, flange_type_id, type_id, construction_id, plating_id, base_id, 
		rotary_plug_id, size_id, d4, d3, d2, d1, h, jumper, jumper_width, has_hole, has_coating, with_retainer, drawing)
		VALUES (:id, :position_id, :standard_id, :flange_type_id, :type_id, :construction_id, :plating_id, :base_id, :rotary_plug_id,
		:size_id, :d4, :d3, :d2, :d1, :h, :jumper, :jumper_width, :has_hole, :has_coating, :with_retainer, :drawing)`,
		PositionSerratedTable,
	)

	dto.Id = uuid.NewString()
	nilId := uuid.Nil.String()
	if dto.Size.Id == "" {
		dto.Size.Id = nilId
	}
	if dto.Material.RotaryPlugId == "" {
		dto.Material.RotaryPlugId = nilId
	}

	data := &pq_models.PositionSerratedDTO{
		Id:             dto.Id,
		PositionId:     dto.PositionId,
		StandardId:     dto.Main.StandardId,
		FlangeTypeId:   dto.Main.FlangeTypeId,
		TypeId:         dto.Main.SerratedTypeId,
		ConstructionId: dto.Main.ConstructionId,
		SizeId:         dto.Size.Id,
		D4:             dto.Size.D4,
		D3:             dto.Size.D3,
		D2:             dto.Size.D2,
		D1:             dto.Size.D1,
		H:              dto.Size.H,
		PlatingId:      dto.Material.PlatingId,
		BaseId:         dto.Material.BaseId,
		RotaryPlugId:   dto.Material.RotaryPlugId,
		Jumper:         dto.Design.Jumper.Code,
		JumperWidth:    dto.Design.Jumper.Width,
		HasHole:        dto.Design.HasHole,
		HasCoating:     dto.Design.HasCoating,
		WithRetainer:   dto.Design.WithRetainer,
		Drawing:        dto.Design.Drawing,
	}

	if _, err := r.db.NamedExecContext(ctx, query, data); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *PositionSerratedRepo) Update(ctx context.Context, dto *models.PositionSerratedDTO) error {
	query := fmt.Sprintf(`UPDATE %s SET standard_id=:standard_id, flange_type_id=:flange_type_id, type_id=:type_id, 
		construction_id=:construction_id, plating_id=:plating_id, base_id=:base_id, rotary_plug_id=:rotary_plug_id, size_id=:size_id, 
		d4=:d4, d3=:d3, d2=:d2, d1=:d1, h=:h, jumper=:jumper, jumper_width=:jumper_width, has_hole=:has_hole, has_coating=:has_coating,
		with_retainer=:with_retainer, drawing=:drawing WHERE position_id=:position_id`,
		PositionSerratedTable,
	)

	nilId := uuid.Nil.String()
	if dto.Size.Id == "" {
		dto.Size.Id = nilId
	}
	if dto.Material.RotaryPlugId == "" {
		dto.Material.RotaryPlugId = nilId
	}

	data := &pq_models.PositionSerratedDTO{
		Id:             dto.Id,
		PositionId:     dto.PositionId,
		StandardId:     dto.Main.StandardId,
		FlangeTypeId:   dto.Main.FlangeTypeId,
		TypeId:         dto.Main.SerratedTypeId,
		ConstructionId: dto.Main.ConstructionId,
		SizeId:         dto.Size.Id,
		D4:             dto.Size.D4,
		D3:             dto.Size.D3,
		D2:             dto.Size.D2,
		D1:             dto.Size.D1,
		H:              dto.Size.H,
		PlatingId:      dto.Material.PlatingId,
		BaseId:         dto.Material.BaseId,
		RotaryPlugId:   dto.Material.RotaryPlugId,
		Jumper:         dto.Design.Jumper.Code,
		JumperWidth:    dto.Design.Jumper.Width,
		HasHole:        dto.Design.HasHole,
		HasCoating:     dto.Design.HasCoating,
		WithRetainer:   dto.Design.WithRetainer,
		Drawing:        dto.Design.Drawing,
	}

	if _, err := r.db.NamedExecContext(ctx, query, data); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *PositionSerratedRepo) Copy(ctx context.Context, dto *models.CopyPositionDTO) (string, error) {
	query := fmt.Sprintf(`INSERT INTO %s(id, position_id, standard_id, flange_type_id, type_id, construction_id, plating_id, base_id, 
		rotary_plug_id, size_id, d4, d3, d2, d1, h, jumper, jumper_width, has_hole, has_coating, with_retainer, drawing) 
		SELECT $1, $2, standard_id, flange_type_id, type_id, construction_id, plating_id, base_id, rotary_plug_id, size_id, d4, d3, d2, d1, h, 
		jumper, jumper_width, has_hole, has_coating, with_retainer, replace(drawing, $3, $4) 
		FROM %s WHERE position_id=$5 RETURNING drawing`,
		PositionSerratedTable, PositionSerratedTable,
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

func (r *PositionSerratedRepo) CopySeveral(ctx context.Context, dto []*models.CopyPositionDTO) error {
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

	query := fmt.Sprintf(`INSERT INTO %s (id, position_id, standard_id, flange_type_id, type_id, construction_id, plating_id, base_id, 
		rotary_plug_id, size_id, d4, d3, d2, d1, h, jumper, jumper_width, has_hole, has_coating, with_retainer, drawing)
		SELECT id::uuid, position_id::uuid, standard_id::uuid, flange_type_id::uuid, type_id::uuid, construction_id::uuid, plating_id::uuid,
			base_id::uuid, rotary_plug_id::uuid, size_id::uuid, d4, d3, d2, d1, h, jumper, jumper_width, has_hole, has_coating, with_retainer, 
			drawing FROM (VALUES %s) AS s(id, position_id, orig_id, from_order_id, order_id)
		LEFT JOIN LATERAL (SELECT standard_id, flange_type_id, type_id, construction_id, plating_id, base_id, rotary_plug_id,
			size_id, d4, d3, d2, d1, h, jumper, jumper_width, has_hole, has_coating, with_retainer,
			replace(drawing, s.from_order_id, s.order_id) AS drawing
			FROM %s WHERE position_id=s.orig_id::uuid) AS m ON true`,
		PositionSerratedTable, strings.Join(values, ","), PositionSerratedTable,
	)

	if _, err := r.db.ExecContext(ctx, query, args...); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

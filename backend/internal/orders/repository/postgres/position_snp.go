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
	snp_models "github.com/Alexander272/new-sealur-pro/internal/snp/models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type PositionSnpRepo struct {
	db *sqlx.DB
}

func NewPositionSnpRepo(db *sqlx.DB) *PositionSnpRepo {
	return &PositionSnpRepo{db: db}
}

type PositionSnp interface {
	Get(ctx context.Context, req *models.GetPositionsDTO) ([]*models.Position, error)
	GetByPosition(ctx context.Context, positionId string) (*models.PositionSnp, error)
	Copy(ctx context.Context, dto *models.CopyPositionDTO) (string, error)
	CopySeveral(ctx context.Context, dto []*models.CopyPositionDTO) error
	Create(ctx context.Context, dto *models.PositionSnpDTO) error
	CreateSeveral(ctx context.Context, dto []*models.PositionSnpDTO) error
	Update(ctx context.Context, dto *models.PositionSnpDTO) error
}

func (r *PositionSnpRepo) Get(ctx context.Context, req *models.GetPositionsDTO) ([]*models.Position, error) {
	query := fmt.Sprintf(`SELECT p.id, title, amount, info, type, count, filler_code, m.arr_mat_code, frame_id, inner_ring_id, outer_ring_id,
		COALESCE(s.d4, ps.d4) AS d4, COALESCE(s.d3, ps.d3) AS d3, COALESCE(s.d2, ps.d2) AS d2, COALESCE(s.d1, ps.d1) AS d1,
		COALESCE(h[h_index+1], '') AS h, another, jumper, jumper_width, has_hole, mounting, drawing
		FROM %s AS p INNER JOIN %s AS ps ON p.id=ps.position_id
		LEFT JOIN LATERAL (SELECT d4, d3, d2, d1, h FROM %s WHERE id=ps.size_id) AS s ON true
		LEFT JOIN LATERAL (SELECT base_code AS filler_code FROM %s WHERE id=ps.filler_id) AS f ON true
		LEFT JOIN LATERAL (SELECT ARRAY_AGG(m.code ORDER BY array_position(array['fr','ir','or'], type)) AS arr_mat_code 
			FROM %s AS sm INNER JOIN %s AS m ON material_id=m.id
			WHERE sm.id=ANY(ARRAY[ps.frame_id, ps.inner_ring_id, ps.outer_ring_id])
		) AS m ON true
		WHERE order_id=$1 AND type=$2 ORDER BY count`,
		PositionTable, PositionSnpTable, SnpSizeTable, SnpFillerTable, SnpMaterialTable, MaterialTable,
	)
	tmp := []*pq_models.BasePositionSnp{}

	if err := r.db.SelectContext(ctx, &tmp, query, req.OrderId, models.PositionTypeSnp); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}

	data := []*models.Position{}
	for _, d := range tmp {
		outerRing := &snp_models.Material{}
		innerRing := &snp_models.Material{}
		if d.OuterRingId != uuid.Nil.String() {
			outerRing = &snp_models.Material{
				Id:   d.OuterRingId,
				Code: d.ArrMaterials[len(d.ArrMaterials)-1],
			}
		}
		if d.InnerRingId != uuid.Nil.String() {
			innerRing = &snp_models.Material{
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
			Type:   models.PositionTypeSnp,
			SnpData: &models.PositionSnp{
				Size: &models.PositionSnp_Size{
					D4:      d.D4,
					D3:      d.D3,
					D2:      d.D2,
					D1:      d.D1,
					H:       d.H,
					Another: d.Another,
				},
				Material: &models.PositionSnp_Material{
					Filler:    &snp_models.Filler{Code: d.FillerCode},
					Frame:     &snp_models.Material{Id: d.FrameId, Code: d.ArrMaterials[0]},
					InnerRing: innerRing,
					OuterRing: outerRing,
				},
				Design: &models.PositionSnp_Design{
					Jumper: &models.PositionSnp_Design_Jumper{
						HasJumper: d.Jumper != "",
						Code:      d.Jumper,
						Width:     d.JumperWidth,
					},
					Mounting: &models.PositionSnp_Design_Mounting{
						HasMounting: d.Mounting != "",
						Code:        d.Mounting,
					},
					HasHole: d.HasHole,
					Drawing: d.Drawing,
				},
			},
		})
	}
	return data, nil
}

func (r *PositionSnpRepo) GetByPosition(ctx context.Context, positionId string) (*models.PositionSnp, error) {
	query := fmt.Sprintf(`SELECT id, position_id, snp_standard_id, snp_type_id, flange_type_id,
		size_id, h_index, another, COALESCE(s.d4, ps.d4) AS d4, COALESCE(s.d3, ps.d3) AS d3, 
		COALESCE(s.d2, ps.d2) AS d2, COALESCE(s.d1, ps.d1) AS d1, COALESCE(dn, '') AS dn, COALESCE(dn_alt, 0) AS dn_alt, 
		COALESCE(pn, '') AS pn, COALESCE(pn_alt, '') AS pn_alt, 
		COALESCE(h[h_index+1], '') AS h, COALESCE(s2[h_index+1], '') AS s2, COALESCE(s3[h_index+1], '') AS s3,
		filler_id, f.filler_code, m.arr_mat_code, frame_id, inner_ring_id, outer_ring_id,
		jumper, jumper_width, has_hole, mounting, drawing
		FROM %s AS ps
		LEFT JOIN LATERAL (SELECT dn, dn_alt, pn, pn_alt, d4, d3, d2, d1, h, s2, s3 FROM %s WHERE id=ps.size_id) AS s ON true
		LEFT JOIN LATERAL (SELECT code AS filler_code FROM %s WHERE id=ps.filler_id) AS f ON true
		LEFT JOIN LATERAL (SELECT ARRAY_AGG(code) AS arr_mat_code FROM %s
			WHERE id=ANY(ARRAY[ps.frame_id, ps.inner_ring_id, ps.outer_ring_id])
		) AS m ON true
		WHERE position_id=$1`,
		PositionSnpTable, SnpSizeTable, SnpFillerTable, SnpMaterialTable,
	)
	tmp := &pq_models.PositionSnp{}

	err := r.db.GetContext(ctx, tmp, query, positionId)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, base.ErrNoRows
		}
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}

	var outerRing, innerRing *snp_models.Material
	if tmp.OuterRingId != uuid.Nil.String() {
		outerRing = &snp_models.Material{
			Id:   tmp.OuterRingId,
			Code: tmp.ArrMaterials[len(tmp.ArrMaterials)-1],
		}
	}
	if tmp.InnerRingId != uuid.Nil.String() {
		innerRing = &snp_models.Material{
			Id:   tmp.InnerRingId,
			Code: tmp.ArrMaterials[1],
		}
	}

	sizeId := ""
	if tmp.SizeId != uuid.Nil.String() {
		sizeId = tmp.SizeId
	}

	data := &models.PositionSnp{
		Main: &models.PositionSnp_Main{
			SnpStandardId: tmp.SnpStandardId,
			SnpTypeId:     tmp.SnpTypeId,
			FlangeTypeId:  tmp.FlangeTypeId,
		},
		Size: &models.PositionSnp_Size{
			Id:      sizeId,
			Dn:      tmp.Dn,
			DnAlt:   tmp.DnAlt,
			Pn:      tmp.Pn,
			PnAlt:   tmp.PnAlt,
			HIndex:  tmp.HIndex,
			D4:      tmp.D4,
			D3:      tmp.D3,
			D2:      tmp.D2,
			D1:      tmp.D1,
			H:       tmp.H,
			S2:      tmp.S2,
			S3:      tmp.S3,
			Another: tmp.Another,
		},
		Material: &models.PositionSnp_Material{
			Filler: &snp_models.Filler{
				Id:   tmp.FillerId,
				Code: tmp.FillerCode,
			},
			Frame: &snp_models.Material{
				Id:   tmp.FrameId,
				Code: tmp.ArrMaterials[0],
			},
			InnerRing: innerRing,
			OuterRing: outerRing,
		},
		Design: &models.PositionSnp_Design{
			Jumper: &models.PositionSnp_Design_Jumper{
				HasJumper: tmp.Jumper != "",
				Code:      tmp.Jumper,
				Width:     tmp.JumperWidth,
			},
			Mounting: &models.PositionSnp_Design_Mounting{
				HasMounting: tmp.Mounting != "",
				Code:        tmp.Mounting,
			},
			HasHole: tmp.HasHole,
			Drawing: tmp.Drawing,
		},
	}

	return data, nil
}

func (r *PositionSnpRepo) Create(ctx context.Context, dto *models.PositionSnpDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, position_id, snp_standard_id, snp_type_id, flange_type_id, 
		size_id, h_index, another, d4, d3, d2, d1,
		filler_id, frame_id, inner_ring_id, outer_ring_id, jumper, jumper_width, has_hole, mounting, drawing)
		VALUES (:id, :position_id, :snp_standard_id, :snp_type_id, :flange_type_id, :size_id, :h_index, :another,
		:d4, :d3, :d2, :d1,	:filler_id, :frame_id, :inner_ring_id, :outer_ring_id, :jumper, :jumper_width, 
		:has_hole, :mounting, :drawing)`,
		PositionSnpTable,
	)
	dto.Id = uuid.NewString()
	nilId := uuid.Nil.String()
	if dto.Size.SizeId == "" {
		dto.Size.SizeId = nilId
	}
	if dto.Material.InnerRingId == "" {
		dto.Material.InnerRingId = nilId
	}
	if dto.Material.OuterRingId == "" {
		dto.Material.OuterRingId = nilId
	}
	data := &pq_models.PositionSnpDTO{
		Id:            dto.Id,
		PositionId:    dto.PositionId,
		SnpStandardId: dto.Main.SnpStandardId,
		SnpTypeId:     dto.Main.SnpTypeId,
		FlangeTypeId:  dto.Main.FlangeTypeId,
		SizeId:        dto.Size.SizeId,
		HIndex:        dto.Size.HIndex,
		Another:       dto.Size.Another,
		D4:            dto.Size.D4,
		D3:            dto.Size.D3,
		D2:            dto.Size.D2,
		D1:            dto.Size.D1,
		FillerId:      dto.Material.FillerId,
		FrameId:       dto.Material.FrameId,
		InnerRingId:   dto.Material.InnerRingId,
		OuterRingId:   dto.Material.OuterRingId,
		Jumper:        dto.Design.Jumper.Code,
		JumperWidth:   dto.Design.Jumper.Width,
		HasHole:       dto.Design.HasHole,
		Mounting:      dto.Design.Mounting,
		Drawing:       dto.Design.Drawing,
	}
	// logger.Debug("create position snp", logger.AnyAttr("data", data))

	_, err := r.db.NamedExecContext(ctx, query, data)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *PositionSnpRepo) CreateSeveral(ctx context.Context, dto []*models.PositionSnpDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, position_id, snp_standard_id, snp_type_id, flange_type_id, size_id, h_index, another, 
		filler_id, frame_id, inner_ring_id, outer_ring_id, jumper, jumper_width, has_hole, mounting, drawing)
		VALUES (:id, :position_id, :snp_standard_id, :snp_type_id, :flange_type_id, :size_id, :h_index, :another,
		:filler_id, :frame_id, :inner_ring_id, :outer_ring_id, :jumper, :jumper_width, :has_hole, :mounting, :drawing)`,
		PositionSnpTable,
	)
	data := []*pq_models.PositionSnpDTO{}

	for i, d := range dto {
		dto[i].Id = uuid.NewString()
		nilId := uuid.Nil.String()
		if dto[i].Size.SizeId == "" {
			dto[i].Size.SizeId = nilId
		}
		if dto[i].Material.InnerRingId == "" {
			dto[i].Material.InnerRingId = nilId
		}
		if dto[i].Material.OuterRingId == "" {
			dto[i].Material.OuterRingId = nilId
		}
		data = append(data, &pq_models.PositionSnpDTO{
			Id:            d.Id,
			PositionId:    d.PositionId,
			SnpStandardId: d.Main.SnpStandardId,
			SnpTypeId:     d.Main.SnpTypeId,
			FlangeTypeId:  d.Main.FlangeTypeId,
			SizeId:        d.Size.SizeId,
			HIndex:        d.Size.HIndex,
			Another:       d.Size.Another,
			D4:            d.Size.D4,
			D3:            d.Size.D3,
			D2:            d.Size.D2,
			D1:            d.Size.D1,
			FillerId:      d.Material.FillerId,
			FrameId:       d.Material.FrameId,
			InnerRingId:   d.Material.InnerRingId,
			OuterRingId:   d.Material.OuterRingId,
			Jumper:        d.Design.Jumper.Code,
			JumperWidth:   d.Design.Jumper.Width,
			HasHole:       d.Design.HasHole,
			Mounting:      d.Design.Mounting,
			Drawing:       d.Design.Drawing,
		})
	}

	_, err := r.db.NamedExecContext(ctx, query, data)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *PositionSnpRepo) Update(ctx context.Context, dto *models.PositionSnpDTO) error {
	query := fmt.Sprintf(`UPDATE %s SET snp_standard_id=:snp_standard_id, snp_type_id=:snp_type_id, flange_type_id=:flange_type_id, 
		size_id=:size_id, h_index=:h_index, another=:another, d4=:d4, d3=:d3, d2=:d2, d1=:d1,
		filler_id=:filler_id, frame_id=:frame_id, inner_ring_id=:inner_ring_id, outer_ring_id=:outer_ring_id, 
		jumper=:jumper, jumper_width=:jumper_width, has_hole=:has_hole, mounting=:mounting, drawing=:drawing
		WHERE position_id=:position_id`,
		PositionSnpTable,
	)

	nilId := uuid.Nil.String()
	if dto.Size.SizeId == "" {
		dto.Size.SizeId = nilId
	}
	if dto.Material.InnerRingId == "" {
		dto.Material.InnerRingId = nilId
	}
	if dto.Material.OuterRingId == "" {
		dto.Material.OuterRingId = nilId
	}
	data := &pq_models.PositionSnpDTO{
		Id:            dto.Id,
		PositionId:    dto.PositionId,
		SnpStandardId: dto.Main.SnpStandardId,
		SnpTypeId:     dto.Main.SnpTypeId,
		FlangeTypeId:  dto.Main.FlangeTypeId,
		SizeId:        dto.Size.SizeId,
		HIndex:        dto.Size.HIndex,
		Another:       dto.Size.Another,
		D4:            dto.Size.D4,
		D3:            dto.Size.D3,
		D2:            dto.Size.D2,
		D1:            dto.Size.D1,
		FillerId:      dto.Material.FillerId,
		FrameId:       dto.Material.FrameId,
		InnerRingId:   dto.Material.InnerRingId,
		OuterRingId:   dto.Material.OuterRingId,
		Jumper:        dto.Design.Jumper.Code,
		JumperWidth:   dto.Design.Jumper.Width,
		HasHole:       dto.Design.HasHole,
		Mounting:      dto.Design.Mounting,
		Drawing:       dto.Design.Drawing,
	}

	_, err := r.db.NamedExecContext(ctx, query, data)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *PositionSnpRepo) Copy(ctx context.Context, dto *models.CopyPositionDTO) (string, error) {
	query := fmt.Sprintf(`INSERT INTO %s (id, position_id, snp_standard_id, snp_type_id, flange_type_id, size_id, h_index, another, 
		filler_id, frame_id, inner_ring_id, outer_ring_id, jumper, jumper_width, has_hole, mounting, drawing)
		SELECT $1, $2, snp_standard_id, snp_type_id, flange_type_id, size_id, h_index, another, filler_id, frame_id, inner_ring_id, 
		outer_ring_id, jumper, jumper_width, has_hole, mounting, replace(drawing, $3, $4) FROM %s 
		WHERE position_id=$5 RETURNING drawing`,
		PositionSnpTable, PositionSnpTable,
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

func (r *PositionSnpRepo) CopySeveral(ctx context.Context, dto []*models.CopyPositionDTO) error {
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

	query := fmt.Sprintf(`INSERT INTO %s (id, position_id, snp_standard_id, snp_type_id, flange_type_id, size_id, h_index, another,
		filler_id, frame_id, inner_ring_id, outer_ring_id, jumper, jumper_width, has_hole, mounting, drawing)
		SELECT id::uuid, position_id::uuid, snp_standard_id::uuid, snp_type_id::uuid, flange_type_id::uuid, size_id::uuid,
			h_index::integer, another, filler_id::uuid, frame_id::uuid, inner_ring_id::uuid, outer_ring_id::uuid, jumper, jumper_width,
			has_hole, mounting, drawing FROM (VALUES %s) AS s(id, position_id, orig_id, from_order_id, order_id)
		LEFT JOIN LATERAL (SELECT snp_standard_id, snp_type_id, flange_type_id, size_id, h_index, another,
			filler_id, frame_id, inner_ring_id, outer_ring_id, jumper, jumper_width, has_hole, mounting, 
			replace(drawing, s.from_order_id, s.order_id) AS drawing FROM %s
			WHERE position_id=s.orig_id::uuid) AS m ON true`,
		PositionSnpTable, strings.Join(values, ","), PositionSnpTable,
	)

	if _, err := r.db.ExecContext(ctx, query, args...); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

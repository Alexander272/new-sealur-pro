package postgres

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

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
	Copy(ctx context.Context, dto *models.CopyPositionDTO) error
	Create(ctx context.Context, dto *models.PositionSnpDTO) error
	CreateSeveral(ctx context.Context, dto []*models.PositionSnpDTO) error
	Update(ctx context.Context, dto *models.PositionSnpDTO) error
}

// func (r *PositionSnpRepo) Get(ctx context.Context, req *models.GetPositionsDTO) ([]*models.Position, error) {}

func (r *PositionSnpRepo) GetByPosition(ctx context.Context, positionId string) (*models.PositionSnp, error) {
	query := fmt.Sprintf(`SELECT id, position_id, snp_standard_id, snp_type_id, flange_type_id,
		size_id, pn_index, h_index, another, COALESCE(s.d4, ps.d4), COALESCE(s.d3, ps.d3), 
		COALESCE(s.d2, ps.d2), COALESCE(s.d1, ps.d1), h[h_index+1],
		filler_id, f.filler_code, m.arr_mat_code, frame_id, inner_ring_id, outer_ring_id,
		jumper, jumper_width, has_hole, mounting, drawing
		FROM %s AS ps
		LEFT JOIN LATERAL (SELECT d4, d3, d2, d1, h FROM %s WHERE id=ps.size_id) AS s ON true
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

	innerRingMat := tmp.ArrMaterials[0]
	if tmp.FrameId != tmp.InnerRingId {
		innerRingMat = tmp.ArrMaterials[1]
	}
	data := &models.PositionSnp{
		Main: &models.PositionSnp_Main{
			SnpStandardId:  tmp.SnpStandardId,
			SnpTypeId:      tmp.SnpTypeId,
			FlangeTypeCode: tmp.FlangeTypeId,
		},
		Size: &models.PositionSnp_Size{
			D4: tmp.D4,
			D3: tmp.D3,
			D2: tmp.D2,
			D1: tmp.D1,
			H:  tmp.H,
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
			InnerRing: &snp_models.Material{
				Id:   tmp.InnerRingId,
				Code: innerRingMat,
			},
			OuterRing: &snp_models.Material{
				Id:   tmp.OuterRingId,
				Code: tmp.ArrMaterials[len(tmp.ArrMaterials)-1],
			},
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

	return data, fmt.Errorf("not implemented")
}

/*
SELECT id, position_id, snp_standard_id, snp_type_id, flange_type_id,
	size_id, pn_index, h_index, another, d4, d3, d2, d1, h[h_index+1],
	filler_id, f.filler_code, m.arr_mat_code, frame_id, inner_ring_id, outer_ring_id,
	jumper, jumper_width, has_hole, mounting, drawing, created_at
	FROM public.position_snp AS ps
	LEFT JOIN LATERAL (SELECT d4, d3, d2, d1, h FROM snp_size WHERE id=ps.size_id) AS s ON true
	LEFT JOIN LATERAL (SELECT code AS filler_code FROM snp_filler_new WHERE id=ps.filler_id) AS f ON true
	LEFT JOIN LATERAL (SELECT ARRAY_AGG(code) AS arr_mat_code FROM snp_material_new
		WHERE id=ANY(ARRAY[ps.frame_id, ps.inner_ring_id, ps.outer_ring_id])
	) AS m ON true
	WHERE position_id=$1
	;
*/

func (r *PositionSnpRepo) Create(ctx context.Context, dto *models.PositionSnpDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, position_id, snp_standard_id, snp_type_id, flange_type_id, 
		size_id, pn_index, h_index, another, d4, d3, d2, d1,
		filler_id, frame_id, inner_ring_id, outer_ring_id, jumper, jumper_width, has_hole, mounting, drawing)
		VALUES (:id, :position_id, :snp_standard_id, :snp_type_id, :flange_type_id, :size_id, :pn_index, :h_index, :another,
		:filler_id, :frame_id, :inner_ring_id, :outer_ring_id, :jumper, :jumper_width, :has_hole, :mounting, :drawing)`,
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
		PnIndex:       dto.Size.PnIndex,
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

func (r *PositionSnpRepo) CreateSeveral(ctx context.Context, dto []*models.PositionSnpDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, position_id, snp_standard_id, snp_type_id, flange_type_id, size_id, pn_index, h_index, another, 
		filler_id, frame_id, inner_ring_id, outer_ring_id, jumper, jumper_width, has_hole, mounting, drawing)
		VALUES (:id, :position_id, :snp_standard_id, :snp_type_id, :flange_type_id, :size_id, :pn_index, :h_index, :another,
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
			PnIndex:       d.Size.PnIndex,
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
		size_id=:size_id, pn_index=:pn_index, h_index=:h_index, another=:another, d4=:d4, d3=:d3, d2=:d2, d1=:d1,
		filler_id=:filler_id, frame_id=:frame_id, inner_ring_id=:inner_ring_id, outer_ring_id=:outer_ring_id, 
		jumper=:jumper, jumper_width=:jumper_width, has_hole=:has_hole, mounting=:mounting, drawing=:drawing
		WHERE id=:id`,
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
		PnIndex:       dto.Size.PnIndex,
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

func (r *PositionSnpRepo) Copy(ctx context.Context, dto *models.CopyPositionDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s (id, position_id, snp_standard_id, snp_type_id, flange_type_id, size_id, pn_index, h_index, another, 
		filler_id, frame_id, inner_ring_id, outer_ring_id, jumper, jumper_width, has_hole, mounting, drawing)
		SELECT $1, $2, snp_standard_id, snp_type_id, flange_type_id, size_id, pn_index, h_index, another, filler_id, frame_id, inner_ring_id, 
		outer_ring_id, jumper, jumper_width, has_hole, mounting, drawing FROM %s WHERE position_id=$3`,
		PositionSnpTable, PositionSnpTable,
	)
	id := uuid.New()

	_, err := r.db.ExecContext(ctx, query, id, dto.NewId, dto.Id)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

// func (r *PositionSnpRepo) Create(ctx context.Context, dto *models.PositionDTO) error {
// 	mainQuery := fmt.Sprintf(`INSERT INTO %s(id, position_id, snp_standard_id, snp_type_id, flange_type_code, flange_type_title)
// 		VALUES ($1, $2, $3, $4, $5, $6)`,
// 		PositionMainSnpTable,
// 	)
// 	sizeQuery := fmt.Sprintf(`INSERT INTO %s(id, position_id, dn, dn_mm, pn_mpa, pn_kg, d4, d3, d2, d1, h, s2, s3, another)
// 		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
// 		PositionSizeSnpTable,
// 	)
// 	materialQuery := fmt.Sprintf(`INSERT INTO %s(id, position_id, filler_id, frame_id, inner_ring_id, outer_ring_id, filler_code, frame_code,
// 		inner_ring_code, outer_ring_code, frame_title, inner_ring_title, outer_ring_title) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
// 		PositionMaterialSnpTable,
// 	)
// 	designQuery := fmt.Sprintf(`INSERT INTO %s(id, position_id, has_jumper, jumper_code, jumper_width, has_hole, has_mounting, mounting_code, drawing)
// 		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
// 		PositionDesignSnpTable,
// 	)

// 	tx, err := r.db.Begin()
// 	if err != nil {
// 		return fmt.Errorf("failed to start transaction. error: %w", err)
// 	}

// 	id := uuid.New()
// 	main := dto.SnpData.Main
// 	size := dto.SnpData.Size
// 	material := dto.SnpData.Material
// 	design := dto.SnpData.Design

// 	nilId := uuid.Nil.String()
// 	if material.InnerRing.Id == "" {
// 		material.InnerRing.Id = nilId
// 	}
// 	if material.OuterRing.Id == "" {
// 		material.OuterRing.Id = nilId
// 	}

// 	_, err = tx.Exec(mainQuery, id, dto.Id, main.SnpStandardId, main.SnpTypeId, main.FlangeTypeCode, main.FlangeTypeTitle)
// 	if err != nil {
// 		tx.Rollback()
// 		return fmt.Errorf("failed to complete query main. error: %w", err)
// 	}
// 	_, err = tx.Exec(sizeQuery, id, dto.Id, size.Dn, size.DnMm, size.Pn.Mpa, size.Pn.Kg, size.D4, size.D3, size.D2, size.D1,
// 		size.H, size.S2, size.S3, size.Another,
// 	)
// 	if err != nil {
// 		tx.Rollback()
// 		return fmt.Errorf("failed to complete query size. error: %w", err)
// 	}
// 	_, err = tx.Exec(materialQuery, id, dto.Id, material.Filler.Id, material.Frame.Id, material.InnerRing.Id, material.OuterRing.Id,
// 		material.Filler.Code, material.Frame.Code, material.InnerRing.Code, material.OuterRing.Code, material.Frame.Title,
// 		material.InnerRing.Title, material.OuterRing.Title,
// 	)
// 	if err != nil {
// 		tx.Rollback()
// 		return fmt.Errorf("failed to complete query material. error: %w", err)
// 	}
// 	_, err = tx.Exec(designQuery, id, dto.Id, design.Jumper.HasJumper, design.Jumper.Code, design.Jumper.Width, design.HasHole,
// 		design.Mounting.HasMounting, design.Mounting.Code, design.Drawing,
// 	)
// 	if err != nil {
// 		tx.Rollback()
// 		return fmt.Errorf("failed to complete query design. error: %w", err)
// 	}

// 	err = tx.Commit()
// 	if err != nil {
// 		return fmt.Errorf("failed to finish transaction. error: %w", err)
// 	}
// 	return nil
// }

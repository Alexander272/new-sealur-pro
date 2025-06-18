package postgres

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"strings"

	jacketed_models "github.com/Alexander272/new-sealur-pro/internal/jacketed/models"
	base "github.com/Alexander272/new-sealur-pro/internal/models"
	"github.com/Alexander272/new-sealur-pro/internal/orders/models"
	"github.com/Alexander272/new-sealur-pro/internal/orders/repository/postgres/pq_models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type PositionJacketedRepo struct {
	db *sqlx.DB
}

func NewPositionJacketedRepo(db *sqlx.DB) *PositionJacketedRepo {
	return &PositionJacketedRepo{
		db: db,
	}
}

type PositionJacketed interface {
	Get(ctx context.Context, req *models.GetPositionsDTO) ([]*models.Position, error)
	GetByPosition(ctx context.Context, positionId string) (*models.PositionJacketed, error)
	GetDrawing(ctx context.Context, positionId string) (string, error)
	Create(ctx context.Context, dto *models.PositionJacketedDTO) error
	Update(ctx context.Context, dto *models.PositionJacketedDTO) error
	Copy(ctx context.Context, dto *models.CopyPositionDTO) (string, error)
	CopySeveral(ctx context.Context, dto []*models.CopyPositionDTO) error
}

func (r *PositionJacketedRepo) Get(ctx context.Context, req *models.GetPositionsDTO) ([]*models.Position, error) {
	query := fmt.Sprintf(`SELECT p.id, title, amount, type, count, info,
		type_code, construction_code, filler_code, shell_id, shell_code, jumper, jumper_width,
		COALESCE(s.d4, ps.d4) AS d4, COALESCE(s.d3, ps.d3) AS d3, COALESCE(s.d2, ps.d2) AS d2, COALESCE(s.d1, ps.d1) AS d1, h,
		drawing
		FROM %s AS p INNER JOIN %s AS ps ON p.id=ps.position_id
		LEFT JOIN LATERAL (SELECT code AS construction_code FROM %s WHERE id=ps.construction_id) AS con ON true
		LEFT JOIN LATERAL (SELECT code AS filler_code FROM %s WHERE id=ps.filler_id) AS pl ON true
		LEFT JOIN LATERAL (SELECT code AS type_code FROM %s AS c WHERE c.id=ps.type_id) AS t ON true
		LEFT JOIN LATERAL (SELECT dn, dn_alt, pn, pn_alt, d4, d3, d2, d1 FROM %s WHERE id=ps.size_id) AS s ON true 
		LEFT JOIN LATERAL (SELECT m.code AS shell_code	FROM %s AS sm INNER JOIN %s AS m ON material_id=m.id
			WHERE sm.id=ps.shell_id
		) AS m ON true
		WHERE order_id=$1 AND type=$2 ORDER BY count`,
		PositionTable, PositionJacketedTable, JacketedConstructionTable, JacketedFillerTable, JacketedTypeTable,
		JacketedSizeTable, JacketedMaterialTable, MaterialTable,
	)
	tmp := []*pq_models.BasePositionJacketed{}

	if err := r.db.SelectContext(ctx, &tmp, query, req.OrderId, models.PositionTypeJacketed); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}

	data := []*models.Position{}
	for _, d := range tmp {
		data = append(data, &models.Position{
			Id:     d.Id,
			Count:  d.Count,
			Title:  d.Title,
			Amount: d.Amount,
			Info:   d.Info,
			Type:   models.PositionType(d.Type),
			JacketedData: &models.PositionJacketed{
				Main: &models.PositionJacketed_Main{
					JacketedType: &jacketed_models.JacketedType{Code: d.TypeCode},
					Construction: &jacketed_models.Construction{Code: d.ConstructionCode},
				},
				Size: &models.PositionJacketed_Size{
					D4: d.D4,
					D3: d.D3,
					D2: d.D2,
					D1: d.D1,
					H:  d.H,
				},
				Material: &models.PositionJacketed_Material{
					Filler: &jacketed_models.Filler{Code: d.FillerCode},
					Shell:  &jacketed_models.Material{Code: d.ShellCode},
				},
				Design: &models.PositionJacketed_Design{
					Jumper: &models.PositionJacketed_Jumper{
						HasJumper: d.Jumper != "",
						Code:      d.Jumper,
						Width:     d.JumperWidth,
					},
					Drawing: d.Drawing,
				},
			},
		})
	}
	return data, nil
}

func (r *PositionJacketedRepo) GetByPosition(ctx context.Context, positionId string) (*models.PositionJacketed, error) {
	query := fmt.Sprintf(`SELECT id, position_id, standard_id, flange_type_id, type_id, construction_id, filler_id, shell_id, 
		size_id, COALESCE(s.d4, ps.d4) AS d4, COALESCE(s.d3, ps.d3) AS d3, COALESCE(s.d2, ps.d2) AS d2, 
		COALESCE(s.d1, ps.d1) AS d1, COALESCE(dn, '') AS dn, COALESCE(dn_alt, 0) AS dn_alt, COALESCE(pn, '') AS pn, 
		COALESCE(pn_alt, '') AS pn_alt, h, jumper, jumper_width, drawing
		FROM %s AS ps
		LEFT JOIN LATERAL (SELECT dn, dn_alt, pn, pn_alt, d4, d3, d2, d1 FROM %s WHERE id=ps.size_id) AS s ON true 
		WHERE position_id=$1`,
		PositionJacketedTable, JacketedSizeTable,
	)
	tmp := &pq_models.PositionJacketed{}

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

	data := &models.PositionJacketed{
		Main: &models.PositionJacketed_Main{
			Standard:     &jacketed_models.StandardInfo{Id: tmp.StandardId},
			FlangeType:   &jacketed_models.FlangeType{Id: tmp.FlangeTypeId},
			JacketedType: &jacketed_models.JacketedType{Id: tmp.TypeId},
			Construction: &jacketed_models.Construction{Id: tmp.ConstructionId},
		},
		Size: &models.PositionJacketed_Size{
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
		Material: &models.PositionJacketed_Material{
			Filler: &jacketed_models.Filler{Id: tmp.FillerId},
			Shell:  &jacketed_models.Material{Id: tmp.ShellId},
		},
		Design: &models.PositionJacketed_Design{
			Jumper: &models.PositionJacketed_Jumper{
				HasJumper: tmp.Jumper != "",
				Code:      tmp.Jumper,
				Width:     tmp.JumperWidth,
			},
			Drawing: tmp.Drawing,
		},
	}
	return data, nil
}

func (r *PositionJacketedRepo) GetDrawing(ctx context.Context, positionId string) (string, error) {
	query := fmt.Sprintf(`SELECT id, position_id, drawing FROM %s WHERE position_id=$1`, PositionJacketedTable)

	data := &pq_models.PositionSnp{}
	if err := r.db.GetContext(ctx, data, query, positionId); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return "", base.ErrNoRows
		}
		return "", fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data.Drawing, nil
}

func (r *PositionJacketedRepo) Create(ctx context.Context, dto *models.PositionJacketedDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, position_id, standard_id, flange_type_id, type_id, construction_id, filler_id, shell_id, 
		size_id, d4, d3, d2, d1, h, jumper, jumper_width, drawing)
		VALUES (:id, :position_id, :standard_id, :flange_type_id, :type_id, :construction_id, :filler_id, :shell_id,
		:size_id, :d4, :d3, :d2, :d1, :h, :jumper, :jumper_width, :drawing)`,
		PositionJacketedTable,
	)

	dto.Id = uuid.NewString()
	nilId := uuid.Nil.String()
	if dto.Size.Id == "" {
		dto.Size.Id = nilId
	}

	data := &pq_models.PositionJacketedDTO{
		Id:             dto.Id,
		PositionId:     dto.PositionId,
		StandardId:     dto.Main.StandardId,
		FlangeTypeId:   dto.Main.FlangeTypeId,
		TypeId:         dto.Main.JacketedTypeId,
		ConstructionId: dto.Main.ConstructionId,
		SizeId:         dto.Size.Id,
		D4:             dto.Size.D4,
		D3:             dto.Size.D3,
		D2:             dto.Size.D2,
		D1:             dto.Size.D1,
		H:              dto.Size.H,
		FillerId:       dto.Material.FillerId,
		ShellId:        dto.Material.ShellId,
		Drawing:        dto.Design.Drawing,
	}

	if _, err := r.db.NamedExecContext(ctx, query, data); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *PositionJacketedRepo) Update(ctx context.Context, dto *models.PositionJacketedDTO) error {
	query := fmt.Sprintf(`UPDATE %s SET standard_id=:standard_id, flange_type_id=:flange_type_id, type_id=:type_id, 
		construction_id=:construction_id, filler_id=:filler_id, shell_id=:shell_id, size_id=:size_id, 
		d4=:d4, d3=:d3, d2=:d2, d1=:d1, h=:h, jumper=:jumper, jumper_width=:jumper_width, drawing=:drawing WHERE position_id=:position_id`,
		PositionJacketedTable,
	)

	nilId := uuid.Nil.String()
	if dto.Size.Id == "" {
		dto.Size.Id = nilId
	}

	data := &pq_models.PositionJacketedDTO{
		Id:             dto.Id,
		PositionId:     dto.PositionId,
		StandardId:     dto.Main.StandardId,
		FlangeTypeId:   dto.Main.FlangeTypeId,
		TypeId:         dto.Main.JacketedTypeId,
		ConstructionId: dto.Main.ConstructionId,
		SizeId:         dto.Size.Id,
		D4:             dto.Size.D4,
		D3:             dto.Size.D3,
		D2:             dto.Size.D2,
		D1:             dto.Size.D1,
		H:              dto.Size.H,
		FillerId:       dto.Material.FillerId,
		ShellId:        dto.Material.ShellId,
		Drawing:        dto.Design.Drawing,
	}

	if _, err := r.db.NamedExecContext(ctx, query, data); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *PositionJacketedRepo) Copy(ctx context.Context, dto *models.CopyPositionDTO) (string, error) {
	query := fmt.Sprintf(`INSERT INTO %s(id, position_id, standard_id, flange_type_id, type_id, construction_id, filler_id, shell_id, 
		size_id, d4, d3, d2, d1, h, jumper, jumper_width, drawing) 
		SELECT $1, $2, standard_id, flange_type_id, type_id, construction_id, filler_id, shell_id, size_id, d4, d3, d2, d1, h, 
		jumper, jumper_width, replace(drawing, $3, $4) 
		FROM %s WHERE position_id=$5 RETURNING drawing`,
		PositionJacketedTable, PositionJacketedTable,
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

func (r *PositionJacketedRepo) CopySeveral(ctx context.Context, dto []*models.CopyPositionDTO) error {
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

	query := fmt.Sprintf(`INSERT INTO %s (id, position_id, standard_id, flange_type_id, type_id, construction_id, filler_id, shell_id, 
		size_id, d4, d3, d2, d1, h, jumper, jumper_width, drawing)
		SELECT id::uuid, position_id::uuid, standard_id::uuid, flange_type_id::uuid, type_id::uuid, construction_id::uuid, filler_id::uuid,
			shell_id::uuid, size_id::uuid, d4, d3, d2, d1, h, jumper, jumper_width, drawing 
			FROM (VALUES %s) AS s(id, position_id, orig_id, from_order_id, order_id)
		LEFT JOIN LATERAL (SELECT standard_id, flange_type_id, type_id, construction_id, filler_id, shell_id,
			size_id, d4, d3, d2, d1, h, jumper, jumper_width, replace(drawing, s.from_order_id, s.order_id) AS drawing
			FROM %s WHERE position_id=s.orig_id::uuid) AS m ON true`,
		PositionJacketedTable, strings.Join(values, ","), PositionJacketedTable,
	)

	if _, err := r.db.ExecContext(ctx, query, args...); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

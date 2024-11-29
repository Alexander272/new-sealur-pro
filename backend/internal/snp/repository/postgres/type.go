package postgres

import (
	"context"
	"fmt"
	"strings"

	"github.com/Alexander272/new-sealur-pro/internal/snp/models"
	"github.com/Alexander272/new-sealur-pro/internal/snp/repository/postgres/pq_models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type TypeRepo struct {
	db *sqlx.DB
}

func NewTypeRepo(db *sqlx.DB) *TypeRepo {
	return &TypeRepo{db: db}
}

type SnpType interface {
	GetBase(ctx context.Context, req *models.GetTypeDTO) ([]*models.SnpType, error)
	GroupByFlange(ctx context.Context, req *models.GetTypeDTO) ([]*models.FlangeWithType, error)
	Create(ctx context.Context, dto *models.TypeDTO) error
	CreateSeveral(ctx context.Context, dto []*models.TypeDTO) error
	Update(ctx context.Context, dto *models.TypeDTO) error
	Delete(ctx context.Context, dto *models.DeleteTypeDTO) error
}

func (r *TypeRepo) GetBase(ctx context.Context, req *models.GetTypeDTO) ([]*models.SnpType, error) {
	query := fmt.Sprintf("SELECT id, title, code FROM %s WHERE snp_standard_id=$1", SnpTypeTable)
	data := []*models.SnpType{}

	if err := r.db.SelectContext(ctx, &data, query, req.StandardId); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *TypeRepo) GroupByFlange(ctx context.Context, req *models.GetTypeDTO) ([]*models.FlangeWithType, error) {
	query := fmt.Sprintf(`SELECT st.id as type_id, st.title as type_title, st.code as type_code, ft.id, ft.title, ft.code,
		st.description, has_d4, has_d3, has_d2, has_d1
		FROM %s AS st INNER JOIN %s AS ft ON ft.id=flange_type_id 
		WHERE st.snp_standard_id=$1 ORDER BY code desc, flange_type_id, st.title`,
		SnpTypeTable, FlangeTypeTable,
	)
	data := []*pq_models.FlangeWithType{}

	if err := r.db.SelectContext(ctx, &data, query, req.StandardId); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}

	types := []*models.FlangeWithType{}
	for i, s := range data {
		data := &models.SnpType{
			Id:    s.TypeId,
			Code:  s.TypeCode,
			Title: s.TypeTitle,
			HasD4: s.HasD4,
			HasD3: s.HasD3,
			HasD2: s.HasD2,
			HasD1: s.HasD1,
		}

		if i > 0 && s.Id == types[len(types)-1].Id {
			types[len(types)-1].Types = append(types[len(types)-1].Types, data)
		} else {
			types = append(types, &models.FlangeWithType{
				Id:          s.Id,
				Title:       s.Title,
				Code:        s.Code,
				Description: s.Description,
				Types:       []*models.SnpType{data},
			})
		}
	}

	return types, nil
}

func (r *TypeRepo) Create(ctx context.Context, dto *models.TypeDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s (id, title, flange_type_id, code, snp_standard_id, description, has_d4, has_d3, has_d2, has_d1) 
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
		SnpTypeTable,
	)
	id := uuid.New()

	_, err := r.db.ExecContext(ctx, query, id, dto.Title, dto.FlangeTypeId, dto.Code, dto.StandardId, dto.Description, dto.HasD4, dto.HasD3, dto.HasD2, dto.HasD1)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *TypeRepo) CreateSeveral(ctx context.Context, dto []*models.TypeDTO) error {
	query := fmt.Sprintf("INSERT INTO %s (id, title, code, flange_type_id, code, snp_standard_id, description, has_d4, has_d3, has_d2, has_d1) VALUES ",
		SnpTypeTable,
	)

	args := make([]interface{}, 0)
	values := make([]string, 0, len(dto))

	c := 10
	for i, s := range dto {
		id := uuid.New()
		values = append(values, fmt.Sprintf("($%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d)",
			i*c+1, i*c+2, i*c+3, i*c+4, i*c+5, i*c+6, i*c+7, i*c+8, i*c+9, i*c+10,
		))
		args = append(args, id, s.Title, s.FlangeTypeId, s.Code, s.StandardId)
	}
	query += strings.Join(values, ", ")

	_, err := r.db.ExecContext(ctx, query, args...)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *TypeRepo) Update(ctx context.Context, dto *models.TypeDTO) error {
	query := fmt.Sprintf(`UPDATE %s	SET title=$1, flange_type_id=$2, code=$3, snp_standard_id=$4, description=$5,
		has_d4=$6, has_d3=$7, has_d2=$8, has_d1=$9 WHERE id=$10`,
		SnpTypeTable,
	)

	_, err := r.db.ExecContext(ctx, query, dto.Title, dto.FlangeTypeId, dto.Code, dto.StandardId, dto.Description,
		dto.HasD4, dto.HasD3, dto.HasD2, dto.HasD1, dto.Id,
	)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *TypeRepo) Delete(ctx context.Context, dto *models.DeleteTypeDTO) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE id=$1`, SnpTypeTable)

	if _, err := r.db.ExecContext(ctx, query, dto.Id); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

package postgres

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/putg/models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type ConfigurationRepo struct {
	db *sqlx.DB
}

func NewConfigurationRepo(db *sqlx.DB) *ConfigurationRepo {
	return &ConfigurationRepo{db: db}
}

type Configuration interface {
	Get(ctx context.Context, req *models.GetConfigurationDTO) ([]*models.Configuration, error)
	Create(ctx context.Context, dto *models.ConfigurationDTO) error
	Update(ctx context.Context, dto *models.ConfigurationDTO) error
	Delete(ctx context.Context, dto *models.DeleteConfigurationDTO) error
}

func (r *ConfigurationRepo) Get(ctx context.Context, req *models.GetConfigurationDTO) ([]*models.Configuration, error) {
	query := fmt.Sprintf(`SELECT id, title, code, has_standard, has_drawing FROM %s ORDER BY is_default DESC`, PutgConfTable)
	data := []*models.Configuration{}

	if err := r.db.SelectContext(ctx, &data, query); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *ConfigurationRepo) Create(ctx context.Context, dto *models.ConfigurationDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s (id, title, code, has_standard, has_drawing, is_default)
		VALUES ($1, $2, $3, $4, $5, $6)`, PutgConfTable,
	)
	dto.Id = uuid.NewString()

	_, err := r.db.ExecContext(ctx, query, dto.Id, dto.Title, dto.Code, dto.HasStandard, dto.HasDrawing, dto.IsDefault)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *ConfigurationRepo) Update(ctx context.Context, dto *models.ConfigurationDTO) error {
	query := fmt.Sprintf(`UPDATE %s SET title=$1, code=$2, has_standard=$3, has_drawing=$4, is_default=$5 WHERE id=$6`, PutgConfTable)

	_, err := r.db.ExecContext(ctx, query, dto.Title, dto.Code, dto.HasStandard, dto.HasDrawing, dto.IsDefault, dto.Id)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *ConfigurationRepo) Delete(ctx context.Context, dto *models.DeleteConfigurationDTO) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE id=$1`, PutgConfTable)

	_, err := r.db.ExecContext(ctx, query, dto.Id)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

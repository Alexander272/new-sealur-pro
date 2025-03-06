package postgres

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	base "github.com/Alexander272/new-sealur-pro/internal/models"
	"github.com/Alexander272/new-sealur-pro/internal/orders/models"
	"github.com/Alexander272/new-sealur-pro/internal/orders/repository/postgres/pq_models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type OrderRepo struct {
	db *sqlx.DB
}

func NewOrderRepo(db *sqlx.DB) *OrderRepo {
	return &OrderRepo{db: db}
}

type Order interface {
	GetCurrent(ctx context.Context, req *models.GetCurrentOrderDTO) (*models.Order, error)
	GetById(ctx context.Context, req *models.GetOrderDTO) (*models.Order, error)
	Get(ctx context.Context, req *models.GetAllOrdersDTO) ([]*models.Order, error)
	Create(ctx context.Context, dto *models.OrderDTO) error
	Save(ctx context.Context, dto *models.SaveOrderDTO) error
	SetInfo(ctx context.Context, dto *models.SetInfoDTO) error
	SetStatus(ctx context.Context, dto *models.SetStatusDTO) error
	SetManager(ctx context.Context, dto *models.SetManagerDTO) error
}

func (r *OrderRepo) GetCurrent(ctx context.Context, req *models.GetCurrentOrderDTO) (*models.Order, error) {
	query := fmt.Sprintf(`SELECT id, number, info FROM "%s" WHERE user_id=$1 AND date=''`, OrderTable)
	data := &models.Order{}

	if err := r.db.GetContext(ctx, data, query, req.UserId); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, base.ErrNoRows
		}
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *OrderRepo) GetById(ctx context.Context, req *models.GetOrderDTO) (*models.Order, error) {
	query := fmt.Sprintf(`SELECT id, date, count_position, info, number, user_id FROM "%s" WHERE id=$1`, OrderTable)
	data := &models.Order{}

	if err := r.db.GetContext(ctx, data, query, req.Id); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, base.ErrNoRows
		}
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *OrderRepo) Get(ctx context.Context, req *models.GetAllOrdersDTO) ([]*models.Order, error) {
	query := fmt.Sprintf(`SELECT o.id, date, o.info, count_position, number, p.id as position_id, title, amount, p.count as position_count, type
		FROM "%s" AS o INNER JOIN %s AS p on order_id=o.id WHERE user_id=$1 AND date != '' ORDER BY number DESC, position_count`,
		OrderTable, PositionTable,
	)
	tmp := []*pq_models.OrderWithPosition{}
	data := []*models.Order{}

	if err := r.db.SelectContext(ctx, &tmp, query, req.UserId); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}

	for i, o := range tmp {
		position := &models.Position{
			Id:      o.PositionId,
			OrderId: o.Id,
			Count:   o.PositionCount,
			Title:   o.Title,
			Amount:  o.Amount,
			Type:    o.Type,
		}

		if i > 0 && o.Id == data[len(data)-1].Id {
			data[len(data)-1].Positions = append(data[len(data)-1].Positions, position)
		} else {
			data = append(data, &models.Order{
				Id:            o.Id,
				Date:          o.Date,
				CountPosition: o.Count,
				Number:        o.Number,
				Info:          o.Info,
				Positions:     []*models.Position{position},
			})
		}

	}
	return data, nil
}

func (r *OrderRepo) Create(ctx context.Context, dto *models.OrderDTO) error {
	query := fmt.Sprintf(`INSERT INTO "%s" (id, user_id, date, count_position, manager_id) 
		VALUES (:id, :user_id, :date, :count_position, (SELECT manager_id FROM "%s" WHERE id=:manager_id))`,
		OrderTable, UserTable,
	)
	dto.Id = uuid.NewString()
	dto.ManagerId = dto.Id

	_, err := r.db.NamedExecContext(ctx, query, dto)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *OrderRepo) Save(ctx context.Context, dto *models.SaveOrderDTO) error {
	query := fmt.Sprintf(`UPDATE "%s" SET date=:date, count_position=:count_position WHERE id=:id`, OrderTable)
	dto.Date = fmt.Sprintf("%d", time.Now().UnixMilli())

	_, err := r.db.NamedExecContext(ctx, query, dto)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *OrderRepo) SetInfo(ctx context.Context, dto *models.SetInfoDTO) error {
	query := fmt.Sprintf(`UPDATE "%s" SET info=:info WHERE id=:id`, OrderTable)

	_, err := r.db.NamedExecContext(ctx, query, dto)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}
func (r *OrderRepo) SetStatus(ctx context.Context, dto *models.SetStatusDTO) error {
	query := fmt.Sprintf(`UPDATE "%s" SET status=$1, %s_date=$2 WHERE id=$3 AND status!=$1`, OrderTable, dto.Status)

	_, err := r.db.ExecContext(ctx, query, dto.Status, dto.Date, dto.OrderId)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}
func (r *OrderRepo) SetManager(ctx context.Context, dto *models.SetManagerDTO) error {
	query := fmt.Sprintf(`UPDATE "%s" SET manager_id=:manager_id WHERE id=:id`, OrderTable)

	_, err := r.db.NamedExecContext(ctx, query, dto)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

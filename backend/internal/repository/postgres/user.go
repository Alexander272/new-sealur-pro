package postgres

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	"github.com/Alexander272/new-sealur-pro/internal/models"
	"github.com/Alexander272/new-sealur-pro/pkg/logger"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type UserRepo struct {
	db *sqlx.DB
}

func NewUserRepo(db *sqlx.DB) *UserRepo {
	return &UserRepo{db: db}
}

type User interface {
	GetById(ctx context.Context, req *models.GetUserByIdDTO) (*models.User, error)
	GetByIdWithManager(ctx context.Context, req *models.GetUserByIdDTO) (*models.UserWithManager, error)
	GetByNick(ctx context.Context, req *models.GetUserByNickDTO) (*models.User, error)
	GetByRegion(ctx context.Context, req *models.GetUserByRegionDTO) (*models.User, error)
	GetManagers(ctx context.Context, req *models.GetManagersDTO) ([]*models.User, error)
	Create(ctx context.Context, dto *models.UserDTO) error
	Confirm(ctx context.Context, dto *models.ConfirmUserDTO) error
	Update(ctx context.Context, dto *models.UserDTO) error
	SetManager(ctx context.Context, dto *models.ChangeManagerDTO) error
}

func (r *UserRepo) Get(Ctx context.Context) {}

func (r *UserRepo) GetById(ctx context.Context, req *models.GetUserByIdDTO) (*models.User, error) {
	query := fmt.Sprintf(`SELECT u.id, realm, nickname, company, inn, kpp, region, city, "position", phone, password, email, 
		r.code AS role, name, address, manager_id, provider_id
		FROM "%s" AS u INNER JOIN %s AS r on r.id=role_id WHERE u.id::text=$1 OR provider_id::text=$2`,
		UserTable, RoleTable,
	)
	user := &models.User{}

	err := r.db.GetContext(ctx, user, query, req.Id, req.ProviderId)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, models.ErrUserNotFound
		}
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return user, nil
}

func (r *UserRepo) GetByIdWithManager(ctx context.Context, req *models.GetUserByIdDTO) (*models.UserWithManager, error) {
	query := fmt.Sprintf(`SELECT u.id, company, "position", phone, u.email, u.name, address, manager_id, nickname, m.name AS manager, m.email AS manager_email
		FROM "%s" AS u 
		INNER JOIN LATERAL (SELECT name, email FROM "%s" AS m WHERE u.manager_id=m.id) AS m ON true
		WHERE u.id::text=$1 OR provider_id::text=$2`,
		UserTable, UserTable,
	)
	user := &models.UserWithManager{}

	err := r.db.GetContext(ctx, user, query, req.Id, req.ProviderId)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, models.ErrUserNotFound
		}
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return user, nil
}

func (r *UserRepo) GetByNick(ctx context.Context, req *models.GetUserByNickDTO) (*models.User, error) {
	query := fmt.Sprintf(`SELECT u.id, realm, nickname, confirmed, company, inn, kpp, region, city, "position", phone, password, 
		email, r.code AS role, name, address
		FROM "%s" AS u INNER JOIN %s AS r ON r.id=role_id WHERE nickname=$1 OR lower(email)=lower($1)`,
		UserTable, RoleTable,
	)
	user := &models.User{}

	err := r.db.GetContext(ctx, user, query, req.Nickname)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, models.ErrUserNotFound
		}
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return user, nil
}

func (r *UserRepo) GetByRegion(ctx context.Context, req *models.GetUserByRegionDTO) (*models.User, error) {
	query := fmt.Sprintf(`SELECT r.manager_id as id, company, inn, kpp, region, city, "position", phone, email, name, address
		FROM %s AS r INNER JOIN "%s" AS u ON u.id=r.manager_id WHERE title=$1`,
		RegionTable, UserTable,
	)
	data := &models.User{}

	if err := r.db.GetContext(ctx, data, query, req.Region); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, models.ErrUserNotFound
		}
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}

	query = fmt.Sprintf(`UPDATE %s SET count_query=count_query+1 WHERE title=$1`, RegionTable)
	_, err := r.db.Exec(query, req.Region)
	if err != nil {
		logger.Error("failed to update count_query.", logger.ErrAttr(err))
		// return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}

	return data, nil
}

func (r *UserRepo) GetManagers(ctx context.Context, req *models.GetManagersDTO) ([]*models.User, error) {
	query := fmt.Sprintf(`SELECT u.id, region, city, "position", phone, email, r.code as role, name
		FROM "%s" AS u INNER JOIN %s AS r on r.id=role_id WHERE r.code='manager'`,
		UserTable, RoleTable,
	)
	data := []*models.User{}

	if err := r.db.SelectContext(ctx, &data, query); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *UserRepo) Create(ctx context.Context, dto *models.UserDTO) error {
	query := fmt.Sprintf(`INSERT INTO "%s" (id, nickname, company, inn, kpp, region, city, "position", password, phone, email, realm,
		role_id, name, address, manager_id, provider_id, use_link, use_landing) VALUES (:id, :nickname, :company, :inn, :kpp, :region, :city, 
		:position, :password, :phone, :email, :realm, :role_id, :name, :address, :manager_id, :provider_id, :use_link, :use_landing)`,
		UserTable,
	)
	if dto.ManagerId == "" {
		dto.ManagerId = uuid.Nil.String()
	}

	_, err := r.db.NamedExecContext(ctx, query, dto)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *UserRepo) Confirm(ctx context.Context, dto *models.ConfirmUserDTO) error {
	query := fmt.Sprintf(`UPDATE "%s" SET confirmed=true, password='', date=:date WHERE id=:id`, UserTable)
	dto.Date = fmt.Sprintf("%d", time.Now().UnixMilli())

	_, err := r.db.NamedExecContext(ctx, query, dto)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *UserRepo) Update(ctx context.Context, dto *models.UserDTO) error {
	query := fmt.Sprintf(`UPDATE "%s" SET nickname=:nickname, company=:company, inn=:inn, kpp=:kpp, region=:region, 
		city=:city, "position"=:position, phone=:phone, email=:email, realm=:realm, name=:name, address=:address, 
		password=:password, provider_id=:provider_id WHERE id=:id`,
		UserTable,
	)

	_, err := r.db.NamedExecContext(ctx, query, dto)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *UserRepo) SetManager(ctx context.Context, dto *models.ChangeManagerDTO) error {
	query := fmt.Sprintf(`UPDATE "%s" SET manager_id=:manager_id WHERE id=:id`, UserTable)

	_, err := r.db.NamedExecContext(ctx, query, dto)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

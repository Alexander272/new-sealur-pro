package services

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"github.com/Alexander272/new-sealur-pro/internal/models"
	"github.com/Alexander272/new-sealur-pro/internal/repository"
	"github.com/Alexander272/new-sealur-pro/pkg/auth"
	"github.com/Alexander272/new-sealur-pro/pkg/hasher"
	"github.com/Nerzal/gocloak/v13"
	"github.com/google/uuid"
)

type UserService struct {
	repo     repository.User
	hasher   hasher.PasswordHasher
	keycloak *auth.KeycloakClient
	role     Role
}

type UserDeps struct {
	Repo     repository.User
	Hasher   hasher.PasswordHasher
	Keycloak *auth.KeycloakClient
	Role     Role
}

func NewUserService(deps *UserDeps) *UserService {
	return &UserService{
		repo:     deps.Repo,
		keycloak: deps.Keycloak,
		hasher:   deps.Hasher,
		role:     deps.Role,
	}
}

type User interface {
	GetById(ctx context.Context, req *models.GetUserByIdDTO) (*models.User, error)
	GetByNick(ctx context.Context, req *models.GetUserByNickDTO) (*models.User, error)
	GetManagers(ctx context.Context, req *models.GetManagersDTO) ([]*models.User, error)
	CreateInProvider(ctx context.Context, user *models.User, req *models.SignInDTO) error
	Create(ctx context.Context, dto *models.UserDTO) error
	Update(ctx context.Context, dto *models.UserDTO) error
	SetManager(ctx context.Context, dto *models.ChangeManagerDTO) error
}

// func (s *UserService) Get(ctx context.Context)

func (s *UserService) GetById(ctx context.Context, req *models.GetUserByIdDTO) (*models.User, error) {
	data, err := s.repo.GetById(ctx, req)
	if err != nil {
		if errors.Is(err, models.ErrUserNotFound) {
			return nil, err
		}
		return nil, fmt.Errorf("failed to get user by id. error: %w", err)
	}
	return data, nil
}

func (s *UserService) GetByNick(ctx context.Context, req *models.GetUserByNickDTO) (*models.User, error) {
	data, err := s.repo.GetByNick(ctx, req)
	if err != nil {
		if errors.Is(err, models.ErrUserNotFound) {
			return nil, err
		}
		return nil, fmt.Errorf("failed to get user by nick. error: %w", err)
	}

	if !data.Confirmed {
		//TODO send email with confirm link
		return nil, models.ErrUserNotVerified
	}
	return data, nil
}

func (s *UserService) GetByRegion(ctx context.Context, req *models.GetUserByRegionDTO) (*models.User, error) {
	data, err := s.repo.GetByRegion(ctx, req)
	if err != nil {
		if errors.Is(err, models.ErrUserNotFound) {
			return nil, err
		}
		return nil, fmt.Errorf("failed to get user by region. error: %w", err)
	}
	return data, nil
}

func (s *UserService) GetManagers(ctx context.Context, req *models.GetManagersDTO) ([]*models.User, error) {
	data, err := s.repo.GetManagers(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get managers. error: %w", err)
	}
	return data, nil
}

func (s *UserService) CreateInProvider(ctx context.Context, user *models.User, req *models.SignInDTO) error {
	dto := &models.UserDTO{
		Id:       user.Id,
		Nickname: user.Nickname,
		Role:     user.Role,
		Company:  user.Company,
		Inn:      user.Inn,
		Kpp:      user.Kpp,
		Region:   user.Region,
		City:     user.City,
		Position: user.Position,
		Phone:    user.Phone,
		Email:    user.Email,
		Realm:    user.Realm,
		Name:     user.Name,
		Address:  user.Address,
		Password: req.Password,
	}
	if dto.Nickname == "" {
		dto.Nickname = strings.Split(dto.Email, "@")[0]
	}

	salt := strings.Split(user.Password, ".")[1]
	pass, err := s.hasher.Hash(req.Password, salt)
	if err != nil {
		return fmt.Errorf("failed to hash password. error: %w", err)
	}

	if fmt.Sprintf("%s.%s", pass, salt) != user.Password {
		return models.ErrPassword
	}

	if err := s.createInProvider(ctx, dto); err != nil {
		return err
	}

	if err := s.Update(ctx, dto); err != nil {
		return err
	}

	user.Realm = dto.Realm
	user.Nickname = dto.Nickname
	user.ProviderId = dto.ProviderId

	return nil
}

func (s *UserService) createInProvider(ctx context.Context, dto *models.UserDTO) error {
	token, err := s.keycloak.GetToken(ctx)
	if err != nil {
		return err
	}
	data := gocloak.User{
		ID:            &dto.Id,
		Username:      &dto.Nickname,
		FirstName:     &dto.Name,
		Email:         &dto.Email,
		Enabled:       gocloak.BoolP(true),
		EmailVerified: gocloak.BoolP(true),
		Attributes: &map[string][]string{
			"company":   {dto.Company},
			"inn":       {dto.Inn},
			"kpp":       {dto.Kpp},
			"region":    {dto.Region},
			"city":      {dto.City},
			"address":   {dto.Address},
			"phone":     {dto.Phone},
			"role":      {dto.Role},
			"origin_id": {dto.Id},
		},
		Groups: &[]string{"pro"},
		Credentials: &[]gocloak.CredentialRepresentation{
			{
				Type:  gocloak.StringP("password"),
				Value: &dto.Password,
			},
		},
	}
	id, err := s.keycloak.Client.CreateUser(ctx, token, s.keycloak.Realm, data)
	if err != nil {
		return fmt.Errorf("failed to create user in keycloak. error: %w", err)
	}
	dto.Realm = s.keycloak.Realm
	dto.Password = ""
	dto.ProviderId = id
	return nil
}

func (s *UserService) Create(ctx context.Context, dto *models.UserDTO) error {
	candidate, err := s.GetByNick(ctx, &models.GetUserByNickDTO{Nickname: dto.Nickname})
	if err != nil {
		if errors.Is(err, models.ErrUserNotVerified) {
			return err
		}
		return fmt.Errorf("failed to get user. error: %w", err)
	}
	if candidate != nil {
		//TODO если пользователь уже зарегистрирован, но не подтвердил почту надо обновлять токен подтверждения
		// или это лучше при логине делать
		return models.ErrUserExist
	}

	if err := s.createInProvider(ctx, dto); err != nil {
		return err
	}

	role, err := s.role.GetDefault(ctx)
	if err != nil {
		return err
	}
	dto.Role = role.Id
	dto.UseLink = dto.ManagerId == "dynamic"
	dto.UseLanding = dto.ManagerId == "landing"
	dto.UseLink = dto.ManagerId != "" && dto.ManagerId != uuid.Nil.String() && dto.ManagerId != "dynamic" && dto.ManagerId != "landing"

	if !dto.UseLink {
		manager, err := s.GetByRegion(ctx, &models.GetUserByRegionDTO{Region: dto.Region})
		if err != nil {
			return err
		}
		dto.ManagerId = manager.Id
	}

	if err = s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create user. error: %w", err)
	}

	//TODO send confirm email
	// можно подтверждение вынести в отдельный сервис и тут просто вызвать функцию (он даже уже у меня есть)

	return nil
}

func (s *UserService) Update(ctx context.Context, dto *models.UserDTO) error {
	err := s.repo.Update(ctx, dto)
	if err != nil {
		return fmt.Errorf("failed to update user. error: %w", err)
	}
	return nil
}

func (s *UserService) SetManager(ctx context.Context, dto *models.ChangeManagerDTO) error {
	if err := s.repo.SetManager(ctx, dto); err != nil {
		return fmt.Errorf("failed to change manager. error: %w", err)
	}
	return nil
}

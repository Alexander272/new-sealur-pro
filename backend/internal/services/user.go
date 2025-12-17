package services

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"github.com/Alexander272/new-sealur-pro/internal/config"
	mail_models "github.com/Alexander272/new-sealur-pro/internal/mail/models"
	mail "github.com/Alexander272/new-sealur-pro/internal/mail/services"
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
	mail     *mail.Services
	role     Role
	confirm  Confirm
	links    config.LinksConfig
}

type UserDeps struct {
	Repo     repository.User
	Hasher   hasher.PasswordHasher
	Keycloak *auth.KeycloakClient
	Mail     *mail.Services
	Role     Role
	Confirm  Confirm
	Links    config.LinksConfig
}

func NewUserService(deps *UserDeps) *UserService {
	return &UserService{
		repo:     deps.Repo,
		keycloak: deps.Keycloak,
		hasher:   deps.Hasher,
		mail:     deps.Mail,
		role:     deps.Role,
		confirm:  deps.Confirm,
		links:    deps.Links,
	}
}

type User interface {
	GetById(ctx context.Context, req *models.GetUserByIdDTO) (*models.User, error)
	GetByIdWithManager(ctx context.Context, req *models.GetUserByIdDTO) (*models.UserWithManager, error)
	GetInfoById(ctx context.Context, req *models.GetUserByIdDTO) (*models.UserInfo, error)
	GetByNick(ctx context.Context, req *models.GetUserByNickDTO) (*models.User, error)
	GetManagers(ctx context.Context, req *models.GetManagersDTO) ([]*models.User, error)
	SearchForProvider(ctx context.Context, dto *models.SignInDTO) (*models.User, error)
	CreateInProvider(ctx context.Context, user *models.User, req *models.SignInDTO) error
	Create(ctx context.Context, dto *models.UserDTO) error
	Confirm(ctx context.Context, code string) (*models.User, error)
	Update(ctx context.Context, dto *models.UserDTO) error
	SetManager(ctx context.Context, dto *models.ChangeManagerDTO) error
	Recovery(ctx context.Context, dto *models.RecoveryDTO) error
	PasswordRecovery(ctx context.Context, dto *models.PasswordRecoveryDTO) error
	UpdatePassword(ctx context.Context, dto *models.UpdatePasswordDTO) error
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

func (s *UserService) GetByIdWithManager(ctx context.Context, req *models.GetUserByIdDTO) (*models.UserWithManager, error) {
	data, err := s.repo.GetByIdWithManager(ctx, req)
	if err != nil {
		if errors.Is(err, models.ErrUserNotFound) {
			return nil, err
		}
		return nil, fmt.Errorf("failed to get user with manager by id. error: %w", err)
	}
	return data, nil
}

func (s *UserService) GetInfoById(ctx context.Context, req *models.GetUserByIdDTO) (*models.UserInfo, error) {
	data, err := s.repo.GetInfoById(ctx, req)
	if err != nil {
		if errors.Is(err, models.ErrUserNotFound) {
			return nil, err
		}
		return nil, fmt.Errorf("failed to get user info by id. error: %w", err)
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
		code, err := s.confirm.Create(ctx, data.Id)
		if err != nil {
			return nil, err
		}
		confirm := &mail_models.ConfirmDTO{
			Email: data.Email,
			Name:  data.Name,
			Link:  fmt.Sprintf("%s/auth/confirm?code=%s", s.links.App, code),
		}
		if err := s.mail.User.Confirm(confirm); err != nil {
			return nil, err
		}
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

// func (s *UserService)

func (s *UserService) SearchForProvider(ctx context.Context, dto *models.SignInDTO) (*models.User, error) {
	token, err := s.keycloak.GetToken(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to login to keycloak. error: %w", err)
	}

	enabled := true
	name := ""
	email := ""
	if strings.Contains(dto.Username, "@") {
		email = dto.Username
		name = strings.SplitN(dto.Username, "@", 2)[0]
	} else {
		name = dto.Username
	}

	users, err := s.keycloak.Client.GetUsers(ctx, token, s.keycloak.Realms[1], gocloak.GetUsersParams{Username: &name, Email: &email, Enabled: &enabled})
	if err != nil {
		return nil, fmt.Errorf("failed to get users from keycloak. error: %w", err)
	}

	if len(users) == 0 {
		return nil, models.ErrUserNotFound
	}

	email = ""
	if users[0].Email != nil {
		email = *users[0].Email
	}
	name, lastName := "", ""
	if users[0].FirstName != nil {
		name = *users[0].FirstName
	}
	if users[0].LastName != nil {
		lastName = *users[0].LastName
	}

	role, err := s.role.GetDefault(ctx)
	if err != nil {
		return nil, err
	}

	userId := uuid.NewString()
	res := &models.User{
		Id:         userId,
		Nickname:   *users[0].Username,
		Email:      email,
		Realm:      s.keycloak.Realms[1],
		Name:       lastName + " " + name,
		Company:    "ООО \"СИЛУР\"",
		Inn:        "5906067331",
		Kpp:        "590601001",
		Region:     "Пермский край",
		City:       "г Пермь",
		Position:   "",
		Phone:      "",
		Address:    "614014, Пермский край, г Пермь, Мотовилихинский р-н, ул 1905 года, д 35 к 24",
		Role:       role.Code,
		Confirmed:  true,
		ProviderId: *users[0].ID,
	}
	createDTO := &models.UserDTO{
		Id:         userId,
		Nickname:   res.Nickname,
		Email:      res.Email,
		Realm:      res.Realm,
		Name:       res.Name,
		Company:    res.Company,
		Inn:        res.Inn,
		Kpp:        res.Kpp,
		Region:     res.Region,
		City:       res.City,
		Position:   res.Position,
		Phone:      res.Phone,
		Address:    res.Address,
		Role:       role.Id,
		Confirmed:  res.Confirmed,
		ProviderId: res.ProviderId,
		ManagerId:  "d8c69456-0887-4b1d-b408-26dcdbe2eea1",
	}

	if err = s.repo.Create(ctx, createDTO); err != nil {
		return nil, fmt.Errorf("failed to create user. error: %w", err)
	}
	return res, nil
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

	id, err := s.getIdFromProvider(ctx, dto)
	if err != nil && !errors.Is(err, models.ErrUserNotFound) {
		return err
	}
	dto.ProviderId = id

	if dto.ProviderId == "" {
		if err := s.createInProvider(ctx, dto); err != nil {
			return err
		}
	}

	dto.Password = ""
	if err := s.Update(ctx, dto); err != nil {
		return err
	}

	user.Realm = dto.Realm
	user.Nickname = dto.Nickname
	user.ProviderId = dto.ProviderId

	return nil
}

func (s *UserService) getIdFromProvider(ctx context.Context, dto *models.UserDTO) (string, error) {
	token, err := s.keycloak.GetToken(ctx)
	if err != nil {
		return "", err
	}

	id := ""
	for _, realm := range s.keycloak.Realms {
		data, err := s.keycloak.Client.GetUsers(ctx, token, realm, gocloak.GetUsersParams{Username: &dto.Nickname})
		if err != nil {
			return "", fmt.Errorf("failed to get user from provider. error: %w", err)
		}

		if len(data) == 0 {
			return "", models.ErrUserNotFound
		}

		dto.Realm = realm
		id = *data[0].ID
	}

	return id, nil
}

func (s *UserService) createInProvider(ctx context.Context, dto *models.UserDTO) error {
	token, err := s.keycloak.GetToken(ctx)
	if err != nil {
		return err
	}

	name := strings.SplitN(dto.Name, " ", 2)
	lastName := ""
	firstName := ""
	if len(name) > 1 {
		lastName = name[0]
		firstName = name[1]
	} else {
		firstName = name[0]
	}

	data := gocloak.User{
		ID:            &dto.Id,
		Username:      &dto.Nickname,
		FirstName:     &firstName,
		LastName:      &lastName,
		Email:         &dto.Email,
		Enabled:       gocloak.BoolP(true),
		EmailVerified: gocloak.BoolP(true),
		Attributes: &map[string][]string{
			"company":   {dto.Company},
			"position":  {dto.Position},
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
	id, err := s.keycloak.Client.CreateUser(ctx, token, s.keycloak.Realms[0], data)
	if err != nil {
		return fmt.Errorf("failed to create user in keycloak. error: %w", err)
	}
	dto.Realm = s.keycloak.Realms[0]
	// dto.Password = ""
	dto.ProviderId = id
	return nil
}

func (s *UserService) Create(ctx context.Context, dto *models.UserDTO) error {
	candidate, err := s.GetByNick(ctx, &models.GetUserByNickDTO{Nickname: dto.Nickname})
	if err != nil && !errors.Is(err, models.ErrUserNotFound) {
		if errors.Is(err, models.ErrUserNotVerified) {
			return err
		}
		return fmt.Errorf("failed to get user. error: %w", err)
	}
	if candidate != nil {
		return models.ErrUserExist
	}

	dto.Id = uuid.NewString()
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
	dto.UseLink = dto.ManagerId != "" && dto.ManagerId != uuid.Nil.String() && !dto.UseLink && !dto.UseLanding

	if !dto.UseLink {
		manager, err := s.GetByRegion(ctx, &models.GetUserByRegionDTO{Region: dto.Region})
		if err != nil {
			return err
		}
		dto.ManagerId = manager.Id
	}
	dto.Password = ""

	if err = s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create user. error: %w", err)
	}

	code, err := s.confirm.Create(ctx, dto.Id)
	if err != nil {
		return err
	}
	confirm := &mail_models.ConfirmDTO{
		Email: dto.Email,
		Name:  dto.Name,
		Link:  fmt.Sprintf("%s/auth/confirm?code=%s", s.links.App, code),
	}
	if err := s.mail.User.Confirm(confirm); err != nil {
		return err
	}
	return nil
}

func (s *UserService) Confirm(ctx context.Context, code string) (*models.User, error) {
	data, err := s.confirm.Get(ctx, code)
	if err != nil {
		return nil, err
	}

	user, err := s.GetById(ctx, &models.GetUserByIdDTO{Id: data.UserId})
	if err != nil {
		return nil, err
	}

	dto := &models.ConfirmUserDTO{Id: data.UserId}
	if err := s.repo.Confirm(ctx, dto); err != nil {
		return nil, fmt.Errorf("failed to confirm user. error: %w", err)
	}
	return user, nil
}

func (s *UserService) Update(ctx context.Context, dto *models.UserDTO) error {
	token, err := s.keycloak.GetToken(ctx)
	if err != nil {
		return err
	}

	name := strings.SplitN(dto.Name, " ", 2)
	lastName := ""
	firstName := ""
	if len(name) > 1 {
		lastName = name[0]
		firstName = name[1]
	} else {
		firstName = name[0]
	}

	data := gocloak.User{
		ID:            &dto.Id,
		Username:      &dto.Nickname,
		FirstName:     &firstName,
		LastName:      &lastName,
		Email:         &dto.Email,
		Enabled:       gocloak.BoolP(true),
		EmailVerified: gocloak.BoolP(true),
		Attributes: &map[string][]string{
			"company":   {dto.Company},
			"position":  {dto.Position},
			"inn":       {dto.Inn},
			"kpp":       {dto.Kpp},
			"region":    {dto.Region},
			"city":      {dto.City},
			"address":   {dto.Address},
			"phone":     {dto.Phone},
			"role":      {dto.Role},
			"origin_id": {dto.Id},
		},
	}

	err = s.keycloak.Client.UpdateUser(ctx, token, dto.Realm, data)
	if err != nil {
		return fmt.Errorf("failed to update user in keycloak. error: %w", err)
	}

	if err := s.repo.Update(ctx, dto); err != nil {
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

func (s *UserService) Recovery(ctx context.Context, dto *models.RecoveryDTO) error {
	user, err := s.repo.GetByNick(ctx, &models.GetUserByNickDTO{Nickname: dto.Email})
	if err != nil {
		return err
	}

	code, err := s.confirm.Create(ctx, user.Id)
	if err != nil {
		return err
	}

	mail := &mail_models.RecoveryDTO{
		Email: user.Email,
		Link:  fmt.Sprintf("%s/auth/recovery/%s", s.links.App, code),
	}
	if err := s.mail.User.Recovery(mail); err != nil {
		return err
	}
	return nil
}

func (s *UserService) PasswordRecovery(ctx context.Context, dto *models.PasswordRecoveryDTO) error {
	data, err := s.confirm.Get(ctx, dto.Code)
	if err != nil {
		return err
	}

	passDTO := &models.UpdatePasswordDTO{UserId: data.UserId, Password: dto.Password}
	if err := s.UpdatePassword(ctx, passDTO); err != nil {
		return err
	}
	return nil
}

func (s *UserService) UpdatePassword(ctx context.Context, dto *models.UpdatePasswordDTO) error {
	user, err := s.GetById(ctx, &models.GetUserByIdDTO{Id: dto.UserId})
	if err != nil {
		return err
	}

	token, err := s.keycloak.GetToken(ctx)
	if err != nil {
		return err
	}

	if user.ProviderId == "" || user.ProviderId == uuid.Nil.String() {
		userDto := &models.UserDTO{
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
			Password: dto.Password,
		}
		if userDto.Nickname == "" {
			userDto.Nickname = strings.Split(userDto.Email, "@")[0]
		}

		if err := s.createInProvider(ctx, userDto); err != nil {
			return err
		}

		userDto.Password = ""
		if err := s.Update(ctx, userDto); err != nil {
			return err
		}
	} else {
		u := gocloak.User{
			ID: &user.ProviderId,
			Credentials: &[]gocloak.CredentialRepresentation{
				{
					Type:  gocloak.StringP("password"),
					Value: &dto.Password,
				},
			},
		}

		if err := s.keycloak.Client.UpdateUser(ctx, token, dto.Realm, u); err != nil {
			return fmt.Errorf("failed to upgrade password: %w", err)
		}
	}

	return nil
}

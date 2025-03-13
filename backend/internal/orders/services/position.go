package services

import (
	"context"
	"errors"
	"fmt"
	"net/url"
	"strings"

	file_models "github.com/Alexander272/new-sealur-pro/internal/files/models"
	"github.com/Alexander272/new-sealur-pro/internal/files/services"
	base "github.com/Alexander272/new-sealur-pro/internal/models"
	"github.com/Alexander272/new-sealur-pro/internal/orders/models"
	"github.com/Alexander272/new-sealur-pro/internal/orders/repository"
)

type PositionService struct {
	repo  repository.Position
	snp   PositionSnp
	putg  PositionPutg
	files services.Files
}

type PositionDeps struct {
	Repo  repository.Position
	Snp   PositionSnp
	Putg  PositionPutg
	Files services.Files
}

func NewPositionService(deps *PositionDeps) *PositionService {
	return &PositionService{
		repo:  deps.Repo,
		snp:   deps.Snp,
		putg:  deps.Putg,
		files: deps.Files,
	}
}

type Position interface {
	Get(ctx context.Context, req *models.GetPositionsDTO) ([]*models.Position, error)
	GetById(ctx context.Context, id string) (*models.Position, error)
	GetIdByTitle(ctx context.Context, req *models.GetPositionByTitle) (string, error)
	Copy(ctx context.Context, dto *models.CopyPositionDTO) error
	CopySeveral(ctx context.Context, dto []*models.CopyPositionDTO) error
	Create(ctx context.Context, dto *models.PositionDTO) error
	Update(ctx context.Context, dto *models.PositionDTO) error
	Delete(ctx context.Context, dto *models.DeletePositionDTO) error
}

func (s *PositionService) Get(ctx context.Context, req *models.GetPositionsDTO) ([]*models.Position, error) {
	data, err := s.repo.Get(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get positions. error: %w", err)
	}
	return data, nil
}

func (s *PositionService) GetById(ctx context.Context, id string) (*models.Position, error) {
	data, err := s.repo.GetById(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get position by id. error: %w", err)
	}

	if data.Type == models.PositionTypeSnp {
		snpData, err := s.snp.GetByPosition(ctx, id)
		if err != nil {
			return nil, err
		}
		// data.SnpData = snpData
		data.Data = snpData
	}
	if data.Type == models.PositionTypePutg {
		putgData, err := s.putg.GetByPosition(ctx, id)
		if err != nil {
			return nil, err
		}
		data.Data = putgData
	}

	//TODO add another types

	return data, nil
}

func (s *PositionService) GetIdByTitle(ctx context.Context, req *models.GetPositionByTitle) (string, error) {
	data, err := s.repo.GetIdByTitle(ctx, req)
	if err != nil && !errors.Is(err, base.ErrNoRows) {
		return "", fmt.Errorf("failed to get position id by title. error: %w", err)
	}
	return data, nil
}

func (s *PositionService) Copy(ctx context.Context, dto *models.CopyPositionDTO) error {
	pos, err := s.repo.GetById(ctx, dto.Id)
	if err != nil {
		return fmt.Errorf("failed to get position. error: %w", err)
	}

	candidate, err := s.GetIdByTitle(ctx, &models.GetPositionByTitle{Title: pos.Title, OrderId: dto.OrderId})
	if err != nil {
		return err
	}
	if candidate != "" {
		return base.ErrPositionExists
	}

	pos.Count = dto.Count
	pos.OrderId = dto.OrderId
	if dto.Amount != "" {
		pos.Amount = dto.Amount
	}

	data := &models.PositionDTO{
		OrderId: dto.OrderId,
		Count:   dto.Count,
		Title:   pos.Title,
		Amount:  dto.Amount,
		Type:    pos.Type,
		Info:    pos.Info,
	}

	// Поскольку я для проверки получаю позицию я могу просто создать новую заменив данные
	if err := s.repo.Create(ctx, data); err != nil {
		return fmt.Errorf("failed to create position. error: %w", err)
	}
	dto.NewId = data.Id

	// if err := s.repo.Copy(ctx, dto); err != nil {
	// 	return fmt.Errorf("failed to copy position. error: %w", err)
	// }

	if pos.Type == models.PositionTypeSnp {
		err = s.snp.Copy(ctx, dto)
	}
	if pos.Type == models.PositionTypePutg {
		err = s.putg.Copy(ctx, dto)
	}
	if err != nil {
		s.Delete(ctx, &models.DeletePositionDTO{Id: data.Id})
		return err
	}

	return nil
}

func (s *PositionService) CopySeveral(ctx context.Context, dto []*models.CopyPositionDTO) error {
	originals, err := s.repo.Get(ctx, &models.GetPositionsDTO{OrderId: dto[0].FromOrderId})
	if err != nil {
		return fmt.Errorf("failed to get positions by from order id. error: %w", err)
	}

	positions, err := s.repo.Get(ctx, &models.GetPositionsDTO{OrderId: dto[0].OrderId})
	if err != nil {
		return fmt.Errorf("failed to get positions by order id. error: %w", err)
	}

	data := []*models.PositionDTO{}
	filtered := make(map[string]*models.CopyPositionDTO)
	candidates := make(map[string]*models.PositionDTO)

	for _, v := range originals {
		tmp := &models.CopyPositionDTO{}
		for _, d := range dto {
			if d.Id == v.Id {
				tmp = d
				break
			}
		}
		filtered[v.Title] = tmp

		candidates[v.Title] = &models.PositionDTO{
			OrderId: tmp.OrderId,
			Count:   tmp.Count,
			Title:   v.Title,
			Amount:  v.Amount,
			Type:    v.Type,
			Info:    v.Info,
		}
	}
	for _, v := range positions {
		delete(candidates, v.Title)
		delete(filtered, v.Title)
	}

	for _, v := range candidates {
		data = append(data, v)
	}

	if err := s.repo.CreateSeveral(ctx, data); err != nil {
		return fmt.Errorf("failed to create positions. error: %w", err)
	}

	snpDTO := []*models.CopyPositionDTO{}
	putgDTO := []*models.CopyPositionDTO{}
	for _, v := range data {
		filtered[v.Title].NewId = v.Id
		if v.Type == models.PositionTypeSnp {
			snpDTO = append(snpDTO, filtered[v.Title])
		}
		if v.Type == models.PositionTypePutg {
			putgDTO = append(putgDTO, filtered[v.Title])
		}
	}

	if len(snpDTO) > 0 {
		err = s.snp.CopySeveral(ctx, snpDTO)
	}
	if len(putgDTO) > 0 {
		err = s.putg.CopySeveral(ctx, putgDTO)
	}
	if err != nil {
		s.DeleteSeveral(ctx, data)
		return err
	}

	group := &file_models.CopyGroupDTO{
		Group:    dto[0].FromOrderId,
		NewGroup: dto[0].OrderId,
	}
	if err := s.files.CopyGroup(ctx, group); err != nil {
		return fmt.Errorf("failed to copy files. error: %w", err)
	}
	return nil
}

func (s *PositionService) Create(ctx context.Context, dto *models.PositionDTO) error {
	candidate, err := s.GetIdByTitle(ctx, &models.GetPositionByTitle{Title: dto.Title, OrderId: dto.OrderId})
	if err != nil {
		return err
	}
	if candidate != "" {
		return base.ErrPositionExists
	}

	if err := s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create position. error: %w", err)
	}

	if dto.Type == models.PositionTypeSnp {
		err = s.snp.Create(ctx, dto)
	}
	if dto.Type == models.PositionTypePutg {
		err = s.putg.Create(ctx, dto)
	}
	if err != nil {
		s.Delete(ctx, &models.DeletePositionDTO{Id: dto.Id})
		return err
	}
	return nil
}

func (s *PositionService) CreateSeveral(ctx context.Context, dto []*models.PositionDTO) error {
	if err := s.repo.CreateSeveral(ctx, dto); err != nil {
		return fmt.Errorf("failed to create positions. error: %w", err)
	}
	return fmt.Errorf("not implemented")
}

func (s *PositionService) Update(ctx context.Context, dto *models.PositionDTO) error {
	if err := s.repo.Update(ctx, dto); err != nil {
		return fmt.Errorf("failed to update position. error: %w", err)
	}

	var err error
	if dto.Type == models.PositionTypeSnp {
		err = s.snp.Update(ctx, dto)
	}
	if dto.Type == models.PositionTypePutg {
		err = s.putg.Update(ctx, dto)
	}
	if err != nil {
		return err
	}
	return nil
}

func (s *PositionService) Delete(ctx context.Context, dto *models.DeletePositionDTO) error {
	drawing := ""
	if dto.Type == models.PositionTypeSnp {
		data, err := s.snp.GetByPosition(ctx, dto.Id)
		if err != nil {
			return err
		}
		drawing = data.Design.Drawing
	}
	if dto.Type == models.PositionTypePutg {
		data, err := s.putg.GetByPosition(ctx, dto.Id)
		if err != nil {
			return err
		}
		drawing = data.Design.Drawing
	}

	if drawing != "" {
		u, err := url.Parse(drawing)
		if err != nil {
			return fmt.Errorf("failed to parse url. error: %w", err)
		}

		q, err := url.ParseQuery(u.RawQuery)
		if err != nil {
			return fmt.Errorf("failed to parse query. error: %w", err)
		}

		name := q.Get("name")
		file := &file_models.DeleteFileDTO{
			Group: q.Get("group"),
			Name:  strings.Split(name, "_")[1],
			Id:    strings.Split(name, "_")[0],
		}
		if err := s.files.Delete(ctx, file); err != nil {
			return fmt.Errorf("failed to delete file. error: %w", err)
		}
	}

	if err := s.repo.Delete(ctx, dto); err != nil {
		return fmt.Errorf("failed to delete position. error: %w", err)
	}
	return nil
}

func (s *PositionService) DeleteSeveral(ctx context.Context, dto []*models.PositionDTO) error {
	tmp := []*models.DeletePositionDTO{}
	for i := range dto {
		tmp = append(tmp, &models.DeletePositionDTO{Id: dto[i].Id})
	}

	if err := s.repo.DeleteSeveral(ctx, tmp); err != nil {
		return fmt.Errorf("failed to delete positions. error: %w", err)
	}
	return nil
}

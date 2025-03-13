package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/files/models"
	"github.com/Alexander272/new-sealur-pro/internal/files/repository"
)

type FilesService struct {
	repo   repository.Files
	Bucket string
}

func NewFilesService(repo repository.Files, bucket string) *FilesService {
	return &FilesService{
		repo:   repo,
		Bucket: bucket,
	}
}

type Files interface {
	Get(ctx context.Context, req *models.GetFileDTO) (*models.File, error)
	GetByGroup(ctx context.Context, req *models.GetFilesByGroupDTO) ([]*models.File, error)
	Create(ctx context.Context, dto *models.FileDTO) error
	Copy(ctx context.Context, dto *models.CopyFileDTO) error
	CopyGroup(ctx context.Context, dto *models.CopyGroupDTO) error
	Delete(ctx context.Context, dto *models.DeleteFileDTO) error
	DeleteGroup(ctx context.Context, dto *models.DeleteGroupDTO) error
}

func (s *FilesService) Get(ctx context.Context, req *models.GetFileDTO) (*models.File, error) {
	req.Name = fmt.Sprintf("%s/%s", req.Group, req.Name)
	data, err := s.repo.Get(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get file. error: %w", err)
	}
	return data, nil
}

func (s *FilesService) GetByGroup(ctx context.Context, req *models.GetFilesByGroupDTO) ([]*models.File, error) {
	data, err := s.repo.GetByGroup(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get files. error: %w", err)
	}
	return data, nil
}

func (s *FilesService) Create(ctx context.Context, dto *models.FileDTO) error {
	if err := dto.NormalizeName(); err != nil {
		return fmt.Errorf("failed to normalize name. err: %w", err)
	}
	if err := s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create file. err: %w", err)
	}
	return nil
}

func (s *FilesService) Copy(ctx context.Context, dto *models.CopyFileDTO) error {
	if dto.Bucket == "" {
		dto.Bucket = s.Bucket
	}
	if err := s.repo.Copy(ctx, dto); err != nil {
		return fmt.Errorf("failed to copy file. err: %w", err)
	}
	return nil
}

func (s *FilesService) CopyGroup(ctx context.Context, dto *models.CopyGroupDTO) error {
	if dto.Bucket == "" {
		dto.Bucket = s.Bucket
	}
	if err := s.repo.CopyGroup(ctx, dto); err != nil {
		return fmt.Errorf("failed to copy group files. err: %w", err)
	}
	return nil
}

func (s *FilesService) Delete(ctx context.Context, dto *models.DeleteFileDTO) error {
	if dto.Bucket == "" {
		dto.Bucket = s.Bucket
	}
	dto.Name = fmt.Sprintf("%s/%s_%s", dto.Group, dto.Id, dto.Name)
	if err := s.repo.Delete(ctx, dto); err != nil {
		return fmt.Errorf("failed to delete file. err: %w", err)
	}
	return nil
}

func (s *FilesService) DeleteGroup(ctx context.Context, dto *models.DeleteGroupDTO) error {
	if err := s.repo.DeleteGroup(ctx, dto); err != nil {
		return fmt.Errorf("failed to delete group files. err: %w", err)
	}
	return nil
}

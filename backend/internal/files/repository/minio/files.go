package minio

import (
	"context"
	"fmt"
	"io"
	"strings"

	"github.com/Alexander272/new-sealur-pro/internal/files/models"
	"github.com/Alexander272/new-sealur-pro/internal/files/pkg/storage"
	"github.com/Alexander272/new-sealur-pro/pkg/logger"
	"github.com/google/uuid"
)

type FilesRepo struct {
	storage storage.Provider
}

func NewFilesRepo(storage storage.Provider) *FilesRepo {
	return &FilesRepo{storage: storage}
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

func (r *FilesRepo) Get(ctx context.Context, req *models.GetFileDTO) (*models.File, error) {
	obj, err := r.storage.GetFile(ctx, req.Bucket, req.Name)
	if err != nil {
		return nil, fmt.Errorf("failed to get file. err: %w", err)
	}
	defer obj.Close()

	objectInfo, err := obj.Stat()
	if err != nil {
		return nil, fmt.Errorf("failed to get file info. err: %w", err)
	}

	buffer := make([]byte, objectInfo.Size)
	_, err = obj.Read(buffer)
	if err != nil && err != io.EOF {
		return nil, fmt.Errorf("failed to get objects. err: %w", err)
	}

	f := &models.File{
		Id:          objectInfo.Key,
		Bucket:      req.Bucket,
		Name:        req.Name,
		Group:       req.Group,
		ContentType: objectInfo.ContentType,
		Size:        objectInfo.Size,
		Bytes:       buffer,
	}
	return f, nil
}

func (r *FilesRepo) GetByGroup(ctx context.Context, req *models.GetFilesByGroupDTO) ([]*models.File, error) {
	objects, err := r.storage.GetBucketFiles(ctx, req.Bucket, req.Group)
	if err != nil {
		return nil, fmt.Errorf("failed to get objects. err: %w", err)
	}
	if len(objects) == 0 {
		return nil, models.ErrNotFound
	}

	var files []*models.File
	for _, obj := range objects {
		stat, err := obj.Stat()
		if err != nil {
			logger.Error("failed to get stat for object.", logger.ErrAttr(err))
			continue
		}
		buffer := make([]byte, stat.Size)
		_, err = obj.Read(buffer)
		if err != nil && err != io.EOF {
			logger.Error("failed to read object.", logger.ErrAttr(err))
			continue
		}
		f := &models.File{
			Id:          stat.Key,
			Bucket:      req.Bucket,
			Group:       req.Group,
			Name:        strings.Split(stat.Key, "/")[1],
			ContentType: stat.ContentType,
			Size:        stat.Size,
			Bytes:       buffer,
		}
		files = append(files, f)
		obj.Close()
	}

	return files, nil
}

func (r *FilesRepo) Create(ctx context.Context, dto *models.FileDTO) error {
	dto.Id = uuid.NewString()
	file := &storage.UploadFileDTO{
		FileId:      fmt.Sprintf("%s/%s_%s", dto.Group, dto.Id, dto.Name),
		FileName:    dto.Name,
		ContentType: dto.ContentType,
		BucketName:  dto.Bucket,
		FileSize:    dto.Size,
		Reader:      dto.Reader,
	}

	if err := r.storage.UploadFile(ctx, file); err != nil {
		return fmt.Errorf("failed to create file. err: %w", err)
	}
	return nil
}

func (r *FilesRepo) Copy(ctx context.Context, dto *models.CopyFileDTO) error {
	file := &storage.CopyFileDTO{
		DestFileId:   dto.NewName,
		DestBucket:   dto.Bucket,
		SourceFileId: dto.Name,
		SourceBucket: dto.Bucket,
	}

	if err := r.storage.CopyFile(ctx, file); err != nil {
		return fmt.Errorf("failed to copy file. err: %w", err)
	}
	return nil
}

func (r *FilesRepo) CopyGroup(ctx context.Context, dto *models.CopyGroupDTO) error {
	group := &storage.CopyGroupFilesDTO{
		Bucket:   dto.Bucket,
		Group:    dto.Group,
		NewGroup: dto.NewGroup,
	}

	if err := r.storage.CopyGroupFiles(ctx, group); err != nil {
		return fmt.Errorf("failed to copy group files. err: %w", err)
	}
	return nil
}

func (r *FilesRepo) Delete(ctx context.Context, dto *models.DeleteFileDTO) error {
	if err := r.storage.DeleteFile(ctx, dto.Bucket, dto.Name); err != nil {
		return fmt.Errorf("failed to delete file. err: %w", err)
	}
	return nil
}

func (r *FilesRepo) DeleteGroup(ctx context.Context, dto *models.DeleteGroupDTO) error {
	if err := r.storage.DeleteGroupFiles(ctx, dto.Bucket, dto.Group); err != nil {
		return fmt.Errorf("failed to delete group files. err: %w", err)
	}
	return nil
}

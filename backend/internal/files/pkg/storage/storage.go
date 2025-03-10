package storage

import (
	"context"

	"github.com/minio/minio-go/v7"
)

type File struct {
	Name string
	Url  string
}

type Provider interface {
	GetFile(ctx context.Context, bucketName, fileId string) (*minio.Object, error)
	GetBucketFiles(ctx context.Context, bucketName, group string) ([]*minio.Object, error)
	UploadFile(ctx context.Context, dto *UploadFileDTO) error
	CopyFile(ctx context.Context, dto *CopyFileDTO) error
	CopyGroupFiles(ctx context.Context, dto *CopyGroupFilesDTO) error
	DeleteFile(ctx context.Context, bucket, fileId string) error
	DeleteGroupFiles(ctx context.Context, bucket, group string) error
}

package storage

import (
	"context"
	"fmt"
	"strings"

	"github.com/Alexander272/new-sealur-pro/internal/config"
	"github.com/Alexander272/new-sealur-pro/pkg/logger"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

type MinioStorage struct {
	Client *minio.Client
}

func NewClient(conf config.MinIOConfig) (*MinioStorage, error) {
	minioClient, err := minio.New(conf.Endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(conf.AccessKey, conf.SecretKey, ""),
		Secure: conf.UseSSL,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create minio client. err: %w", err)
	}

	return &MinioStorage{Client: minioClient}, nil
}

func (c *MinioStorage) GetFile(ctx context.Context, bucketName, fileId string) (*minio.Object, error) {
	obj, err := c.Client.GetObject(ctx, bucketName, fileId, minio.GetObjectOptions{})
	if err != nil {
		return nil, fmt.Errorf("failed to get file with id: %s from minio bucket %s. err: %w", fileId, bucketName, err)
	}
	return obj, nil
}

func (c *MinioStorage) GetBucketFiles(ctx context.Context, bucketName, group string) ([]*minio.Object, error) {
	var files []*minio.Object

	for obj := range c.Client.ListObjects(ctx, bucketName, minio.ListObjectsOptions{Prefix: group, Recursive: true}) {
		if obj.Err != nil {
			logger.Error("failed to list object from minio.", logger.StringAttr("bucket", bucketName), logger.ErrAttr(obj.Err))
			continue
		}
		object, err := c.Client.GetObject(ctx, bucketName, obj.Key, minio.GetObjectOptions{})
		if err != nil {
			logger.Error("failed to get object from minio.",
				logger.StringAttr("key", obj.Key),
				logger.StringAttr("bucket", bucketName),
				logger.ErrAttr(err),
			)
			continue
		}
		files = append(files, object)
	}
	return files, nil
}

func (c *MinioStorage) UploadFile(ctx context.Context, dto *UploadFileDTO) error {
	exists, errBucketExists := c.Client.BucketExists(ctx, dto.BucketName)
	if errBucketExists != nil || !exists {
		logger.Info("bucket does not exist. creating new one...", logger.StringAttr("bucket", dto.BucketName))
		err := c.Client.MakeBucket(ctx, dto.BucketName, minio.MakeBucketOptions{})
		if err != nil {
			return fmt.Errorf("failed to create new bucket. err: %w", err)
		}
	}

	logger.Debug("put new object to bucket", logger.StringAttr("fileName", dto.FileName), logger.StringAttr("bucketName", dto.BucketName))
	_, err := c.Client.PutObject(
		ctx,
		dto.BucketName,
		dto.FileId,
		dto.Reader,
		dto.FileSize,
		minio.PutObjectOptions{
			UserMetadata: map[string]string{
				"Name": dto.FileName,
			},
			ContentType: dto.ContentType,
		},
	)
	if err != nil {
		return fmt.Errorf("failed to upload file. err: %w", err)
	}
	return nil
}

func (c *MinioStorage) CopyFile(ctx context.Context, dto *CopyFileDTO) error {
	// Source object
	srcOpts := minio.CopySrcOptions{
		Bucket: dto.SourceBucket,
		Object: dto.SourceFileId,
	}

	// Destination object
	dstOpts := minio.CopyDestOptions{
		Bucket: dto.DestBucket,
		Object: dto.DestFileId,
	}

	if _, err := c.Client.CopyObject(ctx, dstOpts, srcOpts); err != nil {
		return fmt.Errorf("failed to copy file. error: %w", err)
	}
	return nil
}

func (c *MinioStorage) CopyGroupFiles(ctx context.Context, dto *CopyGroupFilesDTO) error {
	for obj := range c.Client.ListObjects(ctx, dto.Bucket, minio.ListObjectsOptions{Prefix: dto.Group, Recursive: true}) {
		if obj.Err != nil {
			logger.Error("failed to list object from minio.", logger.StringAttr("bucket", dto.Bucket), logger.ErrAttr(obj.Err))
			continue
		}

		// Source object
		srcOpts := minio.CopySrcOptions{
			Bucket: dto.Bucket,
			Object: obj.Key,
		}

		// Destination object
		dstOpts := minio.CopyDestOptions{
			Bucket: dto.Bucket,
			Object: fmt.Sprintf("%s/%s", dto.NewGroup, strings.Split(obj.Key, "/")[1]),
		}

		if _, err := c.Client.CopyObject(ctx, dstOpts, srcOpts); err != nil {
			return fmt.Errorf("failed to copy file. error: %w", err)
		}
	}
	return nil
}

func (c *MinioStorage) DeleteFile(ctx context.Context, bucket, fileId string) error {
	err := c.Client.RemoveObject(ctx, bucket, fileId, minio.RemoveObjectOptions{})
	if err != nil {
		return fmt.Errorf("failed to delete file. err: %w", err)
	}
	return nil
}

func (c *MinioStorage) DeleteGroupFiles(ctx context.Context, bucket, group string) error {
	objectsCh := make(chan minio.ObjectInfo)
	go func() {
		defer close(objectsCh)

		for obj := range c.Client.ListObjects(ctx, bucket, minio.ListObjectsOptions{Prefix: group, Recursive: true}) {
			if obj.Err != nil {
				logger.Error("failed to list object from minio.", logger.StringAttr("bucket", bucket), logger.ErrAttr(obj.Err))
				continue
			}
			objectsCh <- obj
		}
	}()

	errorCh := c.Client.RemoveObjects(ctx, bucket, objectsCh, minio.RemoveObjectsOptions{})
	for e := range errorCh {
		return fmt.Errorf("failed to remove " + e.ObjectName + ", error: " + e.Err.Error())
	}
	return nil
}

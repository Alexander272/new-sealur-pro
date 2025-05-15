package export

import (
	"archive/zip"
	"fmt"
	"io"
	"os"

	"github.com/Alexander272/new-sealur-pro/internal/orders/models"
)

type ZipService struct{}

func NewZipService() *ZipService {
	return &ZipService{}
}

type Zip interface {
	Create(dto *models.ZipDTO) (*models.File, error)
}

func (s *ZipService) Create(dto *models.ZipDTO) (*models.File, error) {
	archive, err := os.Create(dto.Name)
	if err != nil {
		return nil, fmt.Errorf("failed to create zip. error: %w", err)
	}
	defer archive.Close()

	zipWriter := zip.NewWriter(archive)

	for _, f := range dto.Files {
		zipFile, err := zipWriter.Create(f.Name)
		if err != nil {
			return nil, fmt.Errorf("failed to create zip file. error: %w", err)
		}

		if len(f.Bytes) == 0 {
			file, err := os.Open(f.Name)
			if err != nil {
				return nil, fmt.Errorf("failed to open file. error: %w", err)
			}
			defer file.Close()

			if _, err := io.Copy(zipFile, file); err != nil {
				return nil, fmt.Errorf("failed to copy file. error: %w", err)
			}
		} else {
			if _, err := zipFile.Write(f.Bytes); err != nil {
				return nil, fmt.Errorf("failed to write zip file. error: %w", err)
			}
		}
	}

	if err := zipWriter.Close(); err != nil {
		return nil, fmt.Errorf("failed to close writer. err %w", err)
	}

	stats, err := archive.Stat()
	if err != nil {
		return nil, fmt.Errorf("failed to get stats. error: %w", err)
	}

	res := &models.File{Name: dto.Name, Size: stats.Size()}
	return res, nil
}

package export

import (
	"context"
	"fmt"
	"os"

	file_models "github.com/Alexander272/new-sealur-pro/internal/files/models"
	files "github.com/Alexander272/new-sealur-pro/internal/files/services"
	"github.com/Alexander272/new-sealur-pro/internal/orders/constants"
	"github.com/Alexander272/new-sealur-pro/internal/orders/models"
	"github.com/Alexander272/new-sealur-pro/internal/orders/services/position"
	"github.com/Alexander272/new-sealur-pro/pkg/logger"
	"github.com/xuri/excelize/v2"
)

type ExportService struct {
	snp      position.PositionSnp
	putg     position.PositionPutg
	wave     position.PositionWave
	serrated position.PositionSerrated
	files    files.Files
	zip      Zip
}

type ExportDeps struct {
	Snp      position.PositionSnp
	Putg     position.PositionPutg
	Wave     position.PositionWave
	Serrated position.PositionSerrated
	Files    files.Files
	Zip      Zip
}

func NewExportService(deps *ExportDeps) *ExportService {
	return &ExportService{
		snp:      deps.Snp,
		putg:     deps.Putg,
		wave:     deps.Wave,
		serrated: deps.Serrated,
		files:    deps.Files,
		zip:      deps.Zip,
	}
}

type Export interface {
	Prepare(ctx context.Context, dto *models.Order) (*models.File, error)
}

func (s *ExportService) Prepare(ctx context.Context, dto *models.Order) (*models.File, error) {
	file := excelize.NewFile()

	mainSheet := "Заявка"
	file.SetSheetName(file.GetSheetName(file.GetActiveSheetIndex()), mainSheet)

	tempSheetIdx, err := file.NewSheet("для_1С")
	if err != nil {
		return nil, fmt.Errorf("failed to create new sheet. error: %w", err)
	}
	templateSheet := file.GetSheetName(tempSheetIdx)

	styles, err := s.prepareStyles(file)
	if err != nil {
		return nil, fmt.Errorf("failed to prepare styles. error: %w", err)
	}
	extra := make(map[string]*models.ExtraData, len(dto.Positions))
	drawings := make(map[string]string, len(dto.Positions))

	base := &models.Base{
		File:    file,
		Sheet:   mainSheet,
		Columns: constants.MainColumns,
		Order:   dto,
		Extra:   extra,
		Styles:  styles,
	}

	data := &models.Detail{
		File:     file,
		Sheet:    mainSheet,
		OrderId:  dto.Id,
		Column:   len(base.Columns) + 3,
		Row:      1,
		Extra:    extra,
		Drawings: drawings,
		Styles:   styles,
	}
	if err := s.prepareSnp(ctx, data); err != nil {
		return nil, err
	}
	if err := s.preparePutg(ctx, data); err != nil {
		return nil, err
	}
	if err := s.prepareWave(ctx, data); err != nil {
		return nil, err
	}

	if err := s.prepareBase(base); err != nil {
		return nil, err
	}
	base.Sheet = templateSheet
	if err := s.prepareTemplate(base); err != nil {
		return nil, err
	}

	res := &models.File{
		Name: fmt.Sprintf("Заявка %d.xlsx", dto.Number),
	}
	if err := file.SaveAs(res.Name); err != nil {
		return nil, fmt.Errorf("failed to save excel file. error: %w", err)
	}

	if len(drawings) > 0 {
		logger.Debug("get drawings", logger.AnyAttr("drawings", drawings))
		files, err := s.files.GetByGroup(ctx, &file_models.GetFilesByGroupDTO{Group: dto.Id})
		if err != nil {
			return nil, err
		}

		zipDTO := &models.ZipDTO{
			Name: fmt.Sprintf("Заявка %d.zip", dto.Number),
			Files: []*models.File{{
				Name: res.Name,
			}},
		}
		for _, file := range files {
			zipDTO.Files = append(zipDTO.Files, &models.File{
				Name:  drawings[file.Name],
				Bytes: file.Bytes,
			})
		}

		zip, err := s.zip.Create(zipDTO)
		if err != nil {
			return nil, err
		}

		if err := os.Remove(res.Name); err != nil {
			return nil, fmt.Errorf("failed to remove excel file. error: %w", err)
		}
		res.Name = zip.Name
		res.Size = zip.Size
	} else {
		stats, err := os.Stat(res.Name)
		if err != nil {
			return nil, fmt.Errorf("failed to get file stats. error: %w", err)
		}
		res.Size = stats.Size()
	}
	return res, nil
}

func (s *ExportService) appendHeader(dto *models.Header) error {
	// получение координат ячейки
	cell, err := excelize.CoordinatesToCellName(dto.Column, dto.Row)
	if err != nil {
		return fmt.Errorf("failed to get cell. error: %w", err)
	}

	// добавление заголовков таблицы
	if err = dto.File.SetSheetRow(dto.Sheet, cell, &dto.Data); err != nil {
		return fmt.Errorf("failed to create header table. error: %w", err)
	}

	// получение координат ячейки
	endCell, err := excelize.CoordinatesToCellName(dto.Column+len(dto.Data)-1, dto.Row)
	if err != nil {
		return fmt.Errorf("failed to get end cell. error: %w", err)
	}

	// добавление стилей для таблицы
	err = dto.File.SetCellStyle(dto.Sheet, cell, endCell, dto.Style)
	if err != nil {
		return fmt.Errorf("failed to set cell style. error: %w", err)
	}

	return nil
}

func (s *ExportService) appendData(dto *models.Row) error {
	if len(dto.Data) == 0 {
		return nil
	}

	// получение координат ячейки
	cell, err := excelize.CoordinatesToCellName(dto.Column, dto.Row)
	if err != nil {
		return fmt.Errorf("failed to get cell. error: %w", err)
	}

	// добавление данных
	if err = dto.File.SetSheetRow(dto.Sheet, cell, &dto.Data); err != nil {
		return fmt.Errorf("failed to create main line. error: %w", err)
	}

	// получение координат ячейки
	endCell, err := excelize.CoordinatesToCellName(dto.Column+len(dto.Data)-1, dto.Row)
	if err != nil {
		return fmt.Errorf("failed to get end cell. error: %w", err)
	}

	// добавление стилей
	err = dto.File.SetCellStyle(dto.Sheet, cell, endCell, dto.Style)
	if err != nil {
		return fmt.Errorf("failed to set cell style. error: %w", err)
	}

	for _, e := range dto.Extra {
		// получение буквы ячейки
		title, err := excelize.ColumnNumberToName(e.Column)
		if err != nil {
			return fmt.Errorf("failed to get column name. error: %w", err)
		}

		// добавление стилей
		err = dto.File.SetCellStyle(dto.Sheet, fmt.Sprintf("%s%d", title, dto.Row), fmt.Sprintf("%s%d", title, dto.Row), e.Style)
		if err != nil {
			return fmt.Errorf("failed to set cell style. error: %w", err)
		}
	}
	return nil
}

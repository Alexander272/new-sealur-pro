package export

import (
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/orders/constants"
	"github.com/Alexander272/new-sealur-pro/internal/orders/models"
	"github.com/xuri/excelize/v2"
)

func (s *ExportService) prepareBase(dto *models.Base) error {
	header := &models.Header{
		File:   dto.File,
		Sheet:  dto.Sheet,
		Data:   dto.Columns,
		Column: 1,
		Row:    1,
		Style:  dto.Styles.HeaderStyle,
	}
	// добавление заголовков для таблицы
	if err := s.appendHeader(header); err != nil {
		return err
	}

	countColumn, err := excelize.ColumnNumberToName(4)
	if err != nil {
		return fmt.Errorf("failed to get column name. error: %w", err)
	}
	priceColumn, err := excelize.ColumnNumberToName(5)
	if err != nil {
		return fmt.Errorf("failed to get column name. error: %w", err)
	}
	sumColumn, err := excelize.ColumnNumberToName(6)
	if err != nil {
		return fmt.Errorf("failed to get column name. error: %w", err)
	}
	costColumn, err := excelize.ColumnNumberToName(7)
	if err != nil {
		return fmt.Errorf("failed to get column name. error: %w", err)
	}
	templateColumn, err := excelize.ColumnNumberToName(8)
	if err != nil {
		return fmt.Errorf("failed to get column name. error: %w", err)
	}

	for i, p := range dto.Order.Positions {
		extra := dto.Extra[p.Id]

		var sum, cost, price, template string
		if extra != nil {
			price = "=" + extra.PriceCell
			cost = "=" + extra.CostCell
			template = "=" + extra.TemplateCell
			sum = fmt.Sprintf("=%s%d*%s", countColumn, i+2, extra.PriceCell)
		}
		line := []interface{}{p.Count, p.Title, p.Info, p.Amount, sum, cost, price, template}

		row := &models.Row{
			File:   dto.File,
			Sheet:  dto.Sheet,
			Data:   line,
			Column: 1,
			Row:    i + 2,
			Style:  dto.Styles.RowStyle,
			Extra: []*models.Extra{
				{
					Column: 2,
					Style:  dto.Styles.TitleStyle,
				},
			},
		}
		if err := s.appendData(row); err != nil {
			return err
		}

		if err = dto.File.SetCellFormula(dto.Sheet, fmt.Sprintf("%s%d", sumColumn, i+2), sum); err != nil {
			return fmt.Errorf("failed to set cell formula. error: %w", err)
		}
		if err = dto.File.SetCellFormula(dto.Sheet, fmt.Sprintf("%s%d", costColumn, i+2), cost); err != nil {
			return fmt.Errorf("failed to set cell formula. error: %w", err)
		}
		if err = dto.File.SetCellFormula(dto.Sheet, fmt.Sprintf("%s%d", priceColumn, i+2), price); err != nil {
			return fmt.Errorf("failed to set cell formula. error: %w", err)
		}
		if err = dto.File.SetCellFormula(dto.Sheet, fmt.Sprintf("%s%d", templateColumn, i+2), template); err != nil {
			return fmt.Errorf("failed to set cell formula. error: %w", err)
		}

		dto.Extra[p.Id] = &models.ExtraData{
			PriceCell:    fmt.Sprintf("%s!%s%d", dto.Sheet, priceColumn, i+2),
			SumCell:      fmt.Sprintf("%s!%s%d", dto.Sheet, sumColumn, i+2),
			TemplateCell: fmt.Sprintf("%s!%s%d", dto.Sheet, templateColumn, i+2),
		}
	}
	return nil
}

func (s *ExportService) prepareTemplate(dto *models.Base) error {
	header := &models.Header{
		File:   dto.File,
		Sheet:  dto.Sheet,
		Data:   constants.TemplateColumns,
		Column: 1,
		Row:    1,
		Style:  dto.Styles.HeaderStyle,
	}
	// добавление заголовков для таблицы
	if err := s.appendHeader(header); err != nil {
		return err
	}

	priceColumn, err := excelize.ColumnNumberToName(6)
	if err != nil {
		return fmt.Errorf("failed to get column name. error: %w", err)
	}
	sumColumn, err := excelize.ColumnNumberToName(7)
	if err != nil {
		return fmt.Errorf("failed to get column name. error: %w", err)
	}
	templateColumn, err := excelize.ColumnNumberToName(8)
	if err != nil {
		return fmt.Errorf("failed to get column name. error: %w", err)
	}

	units := "шт"
	for i, p := range dto.Order.Positions {
		extra := dto.Extra[p.Id]

		price := "=" + extra.PriceCell
		template := "=" + extra.TemplateCell
		sum := "=" + extra.SumCell
		line := []interface{}{p.Count, p.Title, p.Info, p.Amount, units, price, sum, template}

		row := &models.Row{
			File:   dto.File,
			Sheet:  dto.Sheet,
			Data:   line,
			Column: 1,
			Row:    i + 2,
			Style:  dto.Styles.RowStyle,
			Extra: []*models.Extra{
				{
					Column: 2,
					Style:  dto.Styles.TitleStyle,
				},
			},
		}
		if err := s.appendData(row); err != nil {
			return err
		}

		if err := dto.File.SetCellFormula(dto.Sheet, fmt.Sprintf("%s%d", priceColumn, i+2), price); err != nil {
			return fmt.Errorf("failed to set cell formula. error: %w", err)
		}
		if err := dto.File.SetCellFormula(dto.Sheet, fmt.Sprintf("%s%d", sumColumn, i+2), sum); err != nil {
			return fmt.Errorf("failed to set cell formula. error: %w", err)
		}
		if err := dto.File.SetCellFormula(dto.Sheet, fmt.Sprintf("%s%d", templateColumn, i+2), template); err != nil {
			return fmt.Errorf("failed to set cell formula. error: %w", err)
		}
	}
	return nil
}

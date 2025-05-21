package export

import (
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/orders/models"
	"github.com/xuri/excelize/v2"
)

func (s *ExportService) prepareStyles(file *excelize.File) (*models.Styles, error) {
	border := []excelize.Border{
		{Type: "left", Color: "000000", Style: 7},
		{Type: "top", Color: "000000", Style: 7},
		{Type: "bottom", Color: "000000", Style: 7},
		{Type: "right", Color: "000000", Style: 7},
	}

	headerStyle, err := file.NewStyle(&excelize.Style{
		Fill: excelize.Fill{
			Type:    "pattern",
			Pattern: 1,
			Color:   []string{"d9d9d9"},
		},
		Alignment: &excelize.Alignment{
			Horizontal:     "center",
			Vertical:       "center",
			RelativeIndent: 1,
			ShrinkToFit:    true,
			Indent:         1,
			ReadingOrder:   0,
			WrapText:       true,
		},
		Border: border,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create header style. error: %w", err)
	}

	// стиль для наименования прокладки
	titleStyle, err := file.NewStyle(&excelize.Style{
		Border: border,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create title style. error: %w", err)
	}

	warnStyle, err := file.NewStyle(&excelize.Style{
		Border: border,
		Fill: excelize.Fill{
			Type:    "pattern",
			Pattern: 1,
			Color:   []string{"ffff6d"},
		},
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create warn style. error: %w", err)
	}

	cellStyle, err := file.NewStyle(&excelize.Style{
		Alignment: &excelize.Alignment{
			Horizontal: "center",
		},
		Border: border,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create cell style. error: %w", err)
	}
	styles := &models.Styles{
		HeaderStyle: headerStyle,
		RowStyle:    cellStyle,
		TitleStyle:  titleStyle,
		WarnStyle:   warnStyle,
	}
	return styles, nil
}

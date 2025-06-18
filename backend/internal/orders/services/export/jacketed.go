package export

import (
	"context"
	"fmt"
	"net/url"
	"strings"

	"github.com/Alexander272/new-sealur-pro/internal/orders/constants"
	"github.com/Alexander272/new-sealur-pro/internal/orders/models"
	"github.com/xuri/excelize/v2"
)

func (s *ExportService) prepareJacketed(ctx context.Context, dto *models.Detail) error {
	data, err := s.jacketed.Get(ctx, &models.GetPositionsDTO{OrderId: dto.OrderId})
	if err != nil {
		return err
	}
	if len(data) == 0 {
		return nil
	}

	header := &models.Header{
		File:   dto.File,
		Sheet:  dto.Sheet,
		Data:   constants.JacketedColumns,
		Column: dto.Column,
		Row:    dto.Row,
		Style:  dto.Styles.HeaderStyle,
	}
	if err := s.appendHeader(header); err != nil {
		return err
	}
	dto.Row++

	endColl := dto.Column + len(header.Data) - 1
	template, err := excelize.ColumnNumberToName(endColl)
	if err != nil {
		return fmt.Errorf("failed to get column name. error: %w", err)
	}
	price, err := excelize.ColumnNumberToName(endColl - 1)
	if err != nil {
		return fmt.Errorf("failed to get column name. error: %w", err)
	}
	cost, err := excelize.ColumnNumberToName(endColl - 2)
	if err != nil {
		return fmt.Errorf("failed to get column name. error: %w", err)
	}

	for _, d := range data {
		data := d.JacketedData

		jumper := "M"
		if data.Design.Jumper.HasJumper {
			jumper = data.Design.Jumper.Code
		}
		drawing := ""
		if data.Design.Drawing != "" {
			drawing = "есть"
			u, err := url.Parse(data.Design.Drawing)
			if err != nil {
				return fmt.Errorf("failed to parse url. error: %w", err)
			}

			q, err := url.ParseQuery(u.RawQuery)
			if err != nil {
				return fmt.Errorf("failed to parse query. error: %w", err)
			}
			dto.Drawings[q.Get("name")] = fmt.Sprintf("№%d %s", d.Count, q.Get("orig"))
		}

		data.Size.H = strings.ReplaceAll(data.Size.H, ".", ",")

		line := []interface{}{
			d.Count, d.Title, data.Size.D3, data.Size.D2, data.Size.H, data.Material.Shell.Code,
			data.Material.Filler.Code, jumper, drawing,
			0, 0, "",
		}

		row := &models.Row{
			File:   dto.File,
			Sheet:  dto.Sheet,
			Data:   line,
			Column: dto.Column,
			Row:    dto.Row,
			Style:  dto.Styles.RowStyle,
			Extra: []*models.Extra{
				{
					Column: dto.Column + 1,
					Style:  dto.Styles.TitleStyle,
				},
			},
		}
		if err := s.appendData(row); err != nil {
			return err
		}

		dto.Extra[d.Id] = &models.ExtraData{
			CostCell:     fmt.Sprintf("%s%d", cost, dto.Row),
			PriceCell:    fmt.Sprintf("%s%d", price, dto.Row),
			TemplateCell: fmt.Sprintf("%s%d", template, dto.Row),
		}
		dto.Row++
	}

	dto.Row += 2
	return nil
}

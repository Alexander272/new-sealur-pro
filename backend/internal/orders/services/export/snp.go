package export

import (
	"context"
	"fmt"
	"net/url"

	"github.com/Alexander272/new-sealur-pro/internal/orders/constants"
	"github.com/Alexander272/new-sealur-pro/internal/orders/models"
	"github.com/xuri/excelize/v2"
)

func (s *ExportService) prepareSnp(ctx context.Context, dto *models.Detail) error {
	data, err := s.snp.Get(ctx, &models.GetPositionsDTO{OrderId: dto.OrderId})
	if err != nil {
		return err
	}
	if len(data) == 0 {
		return nil
	}

	header := &models.Header{
		File:   dto.File,
		Sheet:  dto.Sheet,
		Data:   constants.SnpColumns,
		Column: dto.Column,
		Row:    dto.Row,
		Style:  dto.Styles.HeaderStyle,
	}
	if err := s.appendHeader(header); err != nil {
		return err
	}

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

	for i, d := range data {
		thickness := d.SnpData.Size.H
		if thickness == "" {
			thickness = d.SnpData.Size.Another
		}
		jumper := ""
		if d.SnpData.Design.Jumper.HasJumper {
			jumper = fmt.Sprintf("%s/%s", d.SnpData.Design.Jumper.Code, d.SnpData.Design.Jumper.Width)
		}
		hole := ""
		if d.SnpData.Design.HasHole {
			hole = "есть"
		}
		mounting := ""
		if d.SnpData.Design.Mounting.HasMounting {
			mounting = d.SnpData.Design.Mounting.Code
		}
		drawing := ""
		if d.SnpData.Design.Drawing != "" {
			drawing = "есть"
			u, err := url.Parse(d.SnpData.Design.Drawing)
			if err != nil {
				return fmt.Errorf("failed to parse url. error: %w", err)
			}

			q, err := url.ParseQuery(u.RawQuery)
			if err != nil {
				return fmt.Errorf("failed to parse query. error: %w", err)
			}
			dto.Drawings[q.Get("name")] = fmt.Sprintf("№%d %s", d.Count, q.Get("orig"))
		}

		var d4, d1 interface{} = nil, nil
		if d.SnpData.Size.D4 != "" {
			d4 = d.SnpData.Size.D4
		}
		if d.SnpData.Size.D1 != "" {
			d1 = d.SnpData.Size.D1
		}

		line := []interface{}{
			d.Count, d.Title,
			d4, d.SnpData.Size.D3, d.SnpData.Size.D2, d1, thickness,
			d.SnpData.Material.InnerRing.Code, d.SnpData.Material.Frame.Code, d.SnpData.Material.Filler.Code, d.SnpData.Material.OuterRing.Code,
			jumper, hole, mounting, drawing, 0, 0, "",
		}
		row := &models.Row{
			File:   dto.File,
			Sheet:  dto.Sheet,
			Data:   line,
			Column: dto.Column,
			Row:    dto.Row + i + 1,
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
			CostCell:     fmt.Sprintf("%s%d", cost, dto.Row+i+1),
			PriceCell:    fmt.Sprintf("%s%d", price, dto.Row+i+1),
			TemplateCell: fmt.Sprintf("%s%d", template, dto.Row+i+1),
		}
	}
	dto.Row = dto.Row + len(data) + 3

	return nil
}

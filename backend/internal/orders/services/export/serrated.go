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

func (s *ExportService) prepareSerrated(ctx context.Context, dto *models.Detail) error {
	data, err := s.serrated.Get(ctx, &models.GetPositionsDTO{OrderId: dto.OrderId})
	if err != nil {
		return err
	}
	if len(data) == 0 {
		return nil
	}

	header := &models.Header{
		File:   dto.File,
		Sheet:  dto.Sheet,
		Data:   constants.SerratedColumns,
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
		data := d.SerratedData

		jumper := "M"
		if data.Design.Jumper.HasJumper {
			// jumper = fmt.Sprintf("%s/%s", data.Design.Jumper.Code, data.Design.Jumper.Width)
			jumper = data.Design.Jumper.Code
		}
		hole := ""
		if data.Design.HasHole {
			hole = "есть"
		}
		retainer := ""
		if data.Design.WithRetainer {
			retainer = "есть"
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

		construction := strings.TrimLeft(data.Main.Construction.Code, "0")
		waveType := strings.TrimLeft(data.Main.SerratedType.Code, "0")
		data.Size.H = strings.ReplaceAll(data.Size.H, ".", ",")

		var d4, d1 interface{} = nil, nil
		if data.Size.D4 != "" {
			d4 = data.Size.D4
		}
		if data.Size.D1 != "" {
			d1 = data.Size.D1
		}

		plug := "2"
		if data.Material.RotaryPlug.Code != "" {
			plug = data.Material.RotaryPlug.Code
		}

		line := []interface{}{
			d.Count, d.Title, d4, data.Size.D3, data.Size.D2, d1, data.Size.H, waveType, construction, data.Material.Base.Code,
			plug, data.Material.Plating.Code, data.Material.Base.Code, jumper, hole, retainer, drawing,
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

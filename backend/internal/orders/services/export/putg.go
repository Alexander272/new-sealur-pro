package export

import (
	"context"
	"fmt"
	"math"
	"net/url"
	"strconv"
	"strings"
	"unicode/utf8"

	"github.com/Alexander272/new-sealur-pro/internal/orders/constants"
	"github.com/Alexander272/new-sealur-pro/internal/orders/models"
	"github.com/xuri/excelize/v2"
)

func (s *ExportService) preparePutg(ctx context.Context, dto *models.Detail) error {
	data, err := s.putg.Get(ctx, &models.GetPositionsDTO{OrderId: dto.OrderId})
	if err != nil {
		return err
	}
	if len(data) == 0 {
		return nil
	}

	header := &models.Header{
		File:   dto.File,
		Sheet:  dto.Sheet,
		Data:   constants.PutgColumns,
		Column: dto.Column,
		Row:    dto.Row,
		Style:  dto.Styles.HeaderStyle,
	}

	var template, price, cost string

	isFirstOfType := false
	curType := "base"
	for i, d := range data {
		if i == 0 {
			isFirstOfType = true
		}
		if curType != "withRings" && utf8.RuneCountInString(d.PutgData.Material.Construction.Code) == 3 {
			if i != 0 {
				dto.Row += 2
			}
			header.Data = constants.PutgWithRingsColumn
			isFirstOfType = true
			curType = "withRings"
		}
		if curType != "notRound" && d.PutgData.Main.Configuration.Code != "round" {
			if i != 0 {
				dto.Row += 2
			}
			header.Data = constants.PutgNotRounding
			isFirstOfType = true
			curType = "notRound"
		}

		if isFirstOfType {
			header.Row = dto.Row
			if err := s.appendHeader(header); err != nil {
				return err
			}
			isFirstOfType = false
			dto.Row++

			endColl := dto.Column + len(header.Data) - 1
			var err error
			template, err = excelize.ColumnNumberToName(endColl)
			if err != nil {
				return fmt.Errorf("failed to get column name. error: %w", err)
			}
			price, err = excelize.ColumnNumberToName(endColl - 1)
			if err != nil {
				return fmt.Errorf("failed to get column name. error: %w", err)
			}
			cost, err = excelize.ColumnNumberToName(endColl - 2)
			if err != nil {
				return fmt.Errorf("failed to get column name. error: %w", err)
			}
		}

		data := d.PutgData

		jumper := ""
		if data.Design.Jumper.HasJumper {
			// jumper = fmt.Sprintf("%s/%s", data.Design.Jumper.Code, data.Design.Jumper.Width)
			jumper = data.Design.Jumper.Code
		}
		hole := ""
		if data.Design.HasHole {
			hole = "есть"
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

		mica := 0
		if strings.HasPrefix(data.Material.PutgType.Code, "6") {
			mica = 1
		}
		inhibitor := 0
		if strings.HasSuffix(data.Material.PutgType.Code, "5") {
			inhibitor = 1
		}
		removable := 0
		if data.Design.HasRemovable {
			removable = 1
		}
		reinforce := 1
		if strings.HasSuffix(data.Material.PutgType.Code, "05") || strings.HasSuffix(data.Material.PutgType.Code, "00") {
			reinforce = 0
		}
		construction := strings.TrimLeft(data.Material.Construction.Code, "0")
		data.Size.H = strings.ReplaceAll(data.Size.H, ".", ",")

		var field interface{} = nil
		if curType == "notRound" {
			field = data.Size.D1
			if data.Size.UseDimensions {
				d4, err := strconv.ParseFloat(data.Size.D4, 64)
				if err != nil {
					return fmt.Errorf("failed to parse d4. error: %w", err)
				}
				d3, err := strconv.ParseFloat(data.Size.D3, 64)
				if err != nil {
					return fmt.Errorf("failed to parse d3. error: %w", err)
				}
				d2, err := strconv.ParseFloat(data.Size.D2, 64)
				if err != nil {
					return fmt.Errorf("failed to parse d2. error: %w", err)
				}
				d1, err := strconv.ParseFloat(data.Size.D1, 64)
				if err != nil {
					return fmt.Errorf("failed to parse d1. error: %w", err)
				}

				field = math.Max(d4-d3, d2-d1)
				data.Size.D3 = data.Size.D4
			}
			data.Size.D4 = ""
			data.Size.D1 = ""
		}

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

		line := []interface{}{}
		if curType == "notRound" {
			line = []interface{}{
				d.Count, d.Title, data.Size.D3, data.Size.D2, field, data.Size.H, construction,
				reinforce, plug, mica, inhibitor, jumper, hole, drawing,
				0, 0, "",
			}
		}
		if curType == "withRings" {
			line = []interface{}{
				d.Count, d.Title, d4, data.Size.D3, data.Size.D2, d1, data.Size.H, construction, reinforce,
				data.Material.InnerRing.Code, plug, data.Material.OuterRing.Code,
				mica, inhibitor, removable, jumper, hole, drawing,
				0, 0, "",
			}
		}
		if curType == "base" {
			line = []interface{}{
				d.Count, d.Title, data.Size.D3, data.Size.D2, data.Size.H, construction, reinforce,
				plug, mica, inhibitor, removable, jumper, hole, drawing,
				0, 0, "",
			}
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

		if !strings.HasPrefix(data.Material.PutgType.Code, "20") && !strings.HasPrefix(data.Material.PutgType.Code, "23") {
			row.Extra = append(row.Extra, &models.Extra{
				Column: dto.Column + 1,
				Style:  dto.Styles.WarnStyle,
			})
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

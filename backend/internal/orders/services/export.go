package services

import (
	"context"
	"fmt"
	"math"
	"net/url"
	"os"
	"strconv"
	"strings"
	"unicode/utf8"

	file_models "github.com/Alexander272/new-sealur-pro/internal/files/models"
	files "github.com/Alexander272/new-sealur-pro/internal/files/services"
	"github.com/Alexander272/new-sealur-pro/internal/orders/constants"
	"github.com/Alexander272/new-sealur-pro/internal/orders/models"
	"github.com/Alexander272/new-sealur-pro/pkg/logger"
	"github.com/xuri/excelize/v2"
)

type ExportService struct {
	snp   PositionSnp
	putg  PositionPutg
	files files.Files
	zip   Zip
}

type ExportDeps struct {
	Snp   PositionSnp
	Putg  PositionPutg
	Files files.Files
	Zip   Zip
}

func NewExportService(deps *ExportDeps) *ExportService {
	return &ExportService{
		snp:   deps.Snp,
		putg:  deps.Putg,
		files: deps.Files,
		zip:   deps.Zip,
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

func (s *ExportService) prepareStyles(file *excelize.File) (*models.Styles, error) {
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
		Border: []excelize.Border{
			{Type: "left", Color: "000000", Style: 7},
			{Type: "top", Color: "000000", Style: 7},
			{Type: "bottom", Color: "000000", Style: 7},
			{Type: "right", Color: "000000", Style: 7},
		},
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create header style. error: %w", err)
	}

	// стиль для наименования прокладки
	titleStyle, err := file.NewStyle(&excelize.Style{
		Border: []excelize.Border{
			{Type: "left", Color: "000000", Style: 7},
			{Type: "top", Color: "000000", Style: 7},
			{Type: "bottom", Color: "000000", Style: 7},
			{Type: "right", Color: "000000", Style: 7},
		},
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create title style. error: %w", err)
	}

	cellStyle, err := file.NewStyle(&excelize.Style{
		Alignment: &excelize.Alignment{
			Horizontal: "center",
		},
		Border: []excelize.Border{
			{Type: "left", Color: "000000", Style: 7},
			{Type: "top", Color: "000000", Style: 7},
			{Type: "bottom", Color: "000000", Style: 7},
			{Type: "right", Color: "000000", Style: 7},
		},
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create cell style. error: %w", err)
	}
	styles := &models.Styles{
		HeaderStyle: headerStyle,
		RowStyle:    cellStyle,
		TitleStyle:  titleStyle,
	}
	return styles, nil
}

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

		price := "=" + extra.PriceCell
		cost := "=" + extra.CostCell
		template := "=" + extra.TemplateCell
		sum := fmt.Sprintf("=%s%d*%s", countColumn, i+2, extra.PriceCell)
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
			jumper = fmt.Sprintf("%s/%s", data.Design.Jumper.Code, data.Design.Jumper.Width)
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

		line := []interface{}{}
		if curType == "notRound" {
			line = []interface{}{
				d.Count, d.Title, data.Size.D3, data.Size.D2, field, data.Size.H, construction,
				reinforce, data.Material.RotaryPlug.Code, mica, inhibitor, jumper, hole, drawing,
				0, 0, "",
			}
		}
		if curType == "withRings" {
			line = []interface{}{
				d.Count, d.Title, d4, data.Size.D3, data.Size.D2, d1, data.Size.H, construction, reinforce,
				data.Material.InnerRing.Code, data.Material.RotaryPlug.Code, data.Material.OuterRing.Code,
				mica, inhibitor, removable, jumper, hole, drawing,
				0, 0, "",
			}
		}
		if curType == "base" {
			line = []interface{}{
				d.Count, d.Title, data.Size.D3, data.Size.D2, data.Size.H, construction, reinforce,
				data.Material.RotaryPlug.Code, mica, inhibitor, removable, jumper, hole, drawing,
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

	return nil
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

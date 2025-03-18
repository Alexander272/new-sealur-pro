package models

import (
	"github.com/xuri/excelize/v2"
)

type File struct {
	Name  string
	Size  int64
	Bytes []byte
}
type ZipDTO struct {
	Name  string
	Files []*File
}

type Base struct {
	File    *excelize.File
	Sheet   string
	Columns []interface{}
	Order   *Order
	Extra   map[string]*ExtraData
	Styles  *Styles
}
type Detail struct {
	File     *excelize.File
	Sheet    string
	OrderId  string
	Column   int
	Row      int
	Extra    map[string]*ExtraData
	Drawings map[string]string
	Styles   *Styles
}

type ExtraData struct {
	CostCell     string
	PriceCell    string
	TemplateCell string
	SumCell      string
}

type Styles struct {
	HeaderStyle int
	RowStyle    int
	TitleStyle  int
}

type Header struct {
	File   *excelize.File
	Sheet  string
	Data   []interface{}
	Column int
	Row    int
	Style  int
}

type Row struct {
	File   *excelize.File
	Sheet  string
	Data   []interface{}
	Column int
	Row    int
	Style  int
	Extra  []*Extra
	// ExtraColumns []int
	// ExtraStyle   int
}
type Extra struct {
	Column int
	Style  int
}

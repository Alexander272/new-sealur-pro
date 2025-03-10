package models

import (
	"fmt"
	"strings"
	"unicode"

	"golang.org/x/text/runes"
	"golang.org/x/text/transform"
	"golang.org/x/text/unicode/norm"
)

type File struct {
	Id          string `json:"id"`
	Bucket      string `json:"bucket"`
	Name        string `json:"name"`
	Size        int64  `json:"size"`
	Group       string `json:"group"`
	ContentType string `json:"contentType"`
	Bytes       []byte `json:"file"`
}

type GetFileDTO struct {
	Bucket string `json:"bucket"`
	Name   string `json:"name"`
	Id     string `json:"id"`
	Group  string `json:"group"`
}

type GetFilesByGroupDTO struct {
	Bucket string `json:"bucket"`
	Group  string `json:"group"`
}

type FileDTO struct {
	Id          string `json:"id"`
	Bucket      string `json:"bucket"`
	Name        string `json:"name"`
	Size        int64  `json:"size"`
	Group       string `json:"group"`
	ContentType string `json:"contentType"`
	Bytes       []byte `json:"file"`
	// Reader      io.Reader
}

type CopyFileDTO struct {
	Bucket  string `json:"bucket"`
	Name    string `json:"name"`
	NewName string `json:"newName"`
}

type CopyGroupDTO struct {
	Bucket   string `json:"bucket"`
	Group    string `json:"group"`
	NewGroup string `json:"newGroup"`
}

type DeleteFileDTO struct {
	Bucket string `json:"bucket"`
	Group  string `json:"group"`
	Name   string `json:"name"`
	Id     string `json:"id"`
}

type DeleteGroupDTO struct {
	Bucket string `json:"bucket"`
	Group  string `json:"group"`
}

func (f *FileDTO) NormalizeName() error {
	f.Name = strings.ReplaceAll(f.Name, " ", "_")

	t := transform.Chain(norm.NFD, runes.Remove(runes.In(unicode.Mn)), norm.NFC)
	newName, _, err := transform.String(t, f.Name)
	if err != nil {
		return fmt.Errorf("failed to normalize name. error: %w", err)
	}

	f.Name = newName
	return nil
}

// func NewFile(dto *FileDTO) (*File, error) {
// 	bytes, err := io.ReadAll(dto.Reader)
// 	if err != nil {
// 		return nil, fmt.Errorf("failed to create file model. err: %w", err)
// 	}

// 	file := &File{
// 		Id:          uuid.NewString(),
// 		Bucket:      dto.Bucket,
// 		Name:        dto.Name,
// 		Size:        dto.Size,
// 		Group:       dto.Group,
// 		ContentType: dto.ContentType,
// 		Bytes:       bytes,
// 	}

// 	return file, nil
// }

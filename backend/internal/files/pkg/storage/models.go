package storage

import "io"

type UploadFileDTO struct {
	FileId      string
	FileName    string
	ContentType string
	BucketName  string
	FileSize    int64
	Reader      io.Reader
}

type CopyFileDTO struct {
	DestBucket   string
	DestFileId   string
	SourceBucket string
	SourceFileId string
}

type CopyGroupFilesDTO struct {
	Bucket   string
	Group    string
	NewGroup string
}

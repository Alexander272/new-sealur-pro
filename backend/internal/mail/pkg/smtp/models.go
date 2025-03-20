package smtp

// type ContentType string

// const (
// 	TypeAppOctetStream       ContentType = ContentType(mail.TypeAppOctetStream)
// 	TypeMultipartAlternative ContentType = ContentType(mail.TypeMultipartAlternative)
// 	TypeMultipartMixed       ContentType = ContentType(mail.TypeMultipartMixed)
// 	TypeTextHTML             ContentType = ContentType(mail.TypeTextHTML)
// 	TypeTextPlain            ContentType = ContentType(mail.TypeTextPlain)
// )

type SendDTO struct {
	Recipients []string
	ReplyTo    string
	Template   string
	Data       any
	Subject    string
	// BodyType    ContentType
	// Body        string
	// Attachments []*Attachment
}

type Attachment struct {
	Name string
	Blob []byte
}

package templates

import "embed"

//go:embed *.tmpl "partials/*.tmpl"
var Templates embed.FS

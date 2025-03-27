package postgres

import "fmt"

var columns = map[string]string{
	"id":            "o.id",
	"number":        "o.number",
	"date":          "o.date",
	"company":       "u.company",
	"status":        "o.status",
	"countPosition": "count_position",
	"info":          "o.info",
	"user_id":       "o.user_id",
	"user":          "user",
}

func formatField(field string) string {
	return columns[field]
}

func getFilterLine(compare string, fieldName string, count int) string {
	switch compare {
	case "con":
		return fmt.Sprintf("LOWER(%s::text) LIKE LOWER('%%'||$%d||'%%')", fieldName, count)
	case "start":
		return fmt.Sprintf("LOWER(%s) LIKE LOWER($%d||'%%')", fieldName, count)
	case "end":
		return fmt.Sprintf("LOWER(%s) LIKE LOWER('%%'||$%d)", fieldName, count)
	case "like":
		return fmt.Sprintf("LOWER(%s) = LOWER($%d)", fieldName, count)
	case "nlike":
		return fmt.Sprintf("LOWER(%s) != LOWER($%d)", fieldName, count)

	case "in":
		// LOWER(place) ~* 'test|Отдел технического сервиса'
		// LOWER(place) ILIKE ANY (ARRAY['test %','Отдел технического сервиса %'])
		return fmt.Sprintf("LOWER(%s::text) ~* $%d", fieldName, count)
	case "nin":
		return fmt.Sprintf("LOWER(%s::text) !~* $%d", fieldName, count)

	case "eq":
		return fmt.Sprintf("%s = $%d", fieldName, count)
	case "neq":
		return fmt.Sprintf("%s != $%d", fieldName, count)
	case "gte":
		return fmt.Sprintf("%s >= $%d", fieldName, count)
	case "lte":
		return fmt.Sprintf("%s <= $%d", fieldName, count)

	case "null":
		return fmt.Sprintf("%s IS NULL", fieldName)
	}

	return ""
}

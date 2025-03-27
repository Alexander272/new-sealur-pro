export const FormatNumber = (data?: number) => {
	return new Intl.NumberFormat('ru').format(data || 0)
}

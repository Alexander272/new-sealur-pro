const dateOption: Intl.DateTimeFormatOptions = {
	// weekday: "short",
	year: '2-digit',
	month: 'short',
	day: 'numeric',
}

export const stampToDate = (stamp: number) => {
	return new Date(stamp).toLocaleDateString('ru-GB', dateOption)
}

const dateOption: Intl.DateTimeFormatOptions = {
	// weekday: "short",
	year: '2-digit',
	month: 'short',
	day: '2-digit',
}

// преобразование штампа в дату определенного формата
export const stampToDate = (stamp: number) => {
	return new Date(stamp).toLocaleDateString('ru-GB', dateOption)
}

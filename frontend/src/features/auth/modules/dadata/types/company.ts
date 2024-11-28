export type CompanyInfo = {
	value: string // Наименование компании
	data: {
		hid: string // Внутренний идентификатор в Дадате
		inn: string // ИНН
		kpp: string // КПП
		address: {
			value: string // — адрес одной строкой
			unrestricted_value: string // — адрес одной строкой (полный, с индексом)
			data: {
				region_with_type: string // регион'Пермский край'
				city_with_type: string // 'г Пермь'
			}
		}
	}
}

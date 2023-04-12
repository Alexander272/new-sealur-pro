const url = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party'
const token = '9a6dcd7726f126ca397fedf086f2ee87ff9319f1'

let options: any = {
	method: 'POST',
	mode: 'cors',
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
		Authorization: 'Token ' + token,
	},
}

// часть возвращаемых данных (то, что используется в программе)
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

// получение данных о компании по ее наименованию или инн (используется api https://dadata.ru/api/suggest/party)
export const findCompany = async (value: string) => {
	options.body = JSON.stringify({ query: value })
	try {
		const response = await fetch(url, options)
		const data = await response.json()
		console.log(data)
		return { data: data.suggestions, error: null }
	} catch (error) {
		return { data: null, error: error }
	}
}

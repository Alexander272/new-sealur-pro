// при сохранении чертежа используются userId для создания папки, если пользователь не авторизован можно использовать его ip для именования папки, а затем при авторизации переносить все картинки (или переименовывать папку)

const baseUrl = '/api/v1/'

// добавление чертежа
export async function CreateFile(url: string, data: FormData) {
	let options: any = {
		method: 'POST',
		// headers: {
		// 	'Content-Type': 'application/json',
		// 	Accept: 'application/json',
		// },
		body: data,
	}

	try {
		const response = await fetch(baseUrl + url, options)
		const data = await response.json()

		if (response.ok) return { data: data, error: null }
		else return { data: null, error: data.message }
	} catch (error: any) {
		return { data: null, error: error }
	}
}

// удаление чертежа
export async function DeleteFile(url: string) {
	let options: any = {
		method: 'DELETE',
	}

	try {
		const response = await fetch(baseUrl + url, options)
		const data = await response.json()

		if (response.ok) return { error: null }
		else return { error: data.message }
	} catch (error: any) {
		return { error: error }
	}
}

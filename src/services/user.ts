const url = '/api/v1/users'

let options: any = {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
}

// подтверждение пользователя
export const confirm = async (code: string) => {
	try {
		const response = await fetch(`${url}/confirm/${code}`, options)
		const data = await response.json()

		if (response.ok) return { data: data, error: null }
		else return { data: null, error: data.message }
	} catch (error: any) {
		return { data: null, error: error }
	}
}

// запрос на получение кода для восстановления пароля
export const recovery = async (email: string) => {
	options.body = JSON.stringify({ email })
	try {
		const response = await fetch(url + '/recovery', options)
		const data = await response.json()

		if (response.ok) return { error: null }
		else return { error: data.message }
	} catch (error: any) {
		return { error: error }
	}
}

// запрос на обновление пароля
export const recoveryPassword = async (password: string, code: string) => {
	options.body = JSON.stringify({ password })
	try {
		const response = await fetch(`${url}/recovery/${code}`, options)
		const data = await response.json()

		if (response.ok) return { error: null }
		else return { error: data.message }
	} catch (error: any) {
		return { error: error }
	}
}

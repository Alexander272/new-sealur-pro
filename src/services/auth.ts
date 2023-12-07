import { ISignIn, ISignUp } from '@/types/auth'

const url = '/api/v1/auth/'

let options: any = {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
}

//TODO переписать все эти сервисы на toolkit
export const signIn = async (value: ISignIn) => {
	options.body = JSON.stringify(value)
	try {
		const response = await fetch(url + 'sign-in', options)
		const data = await response.json()

		if (response.ok) return { data: data, error: null }
		else return { data: null, error: data.message }
	} catch (error: any) {
		return { data: null, error: error }
	}
}

export const signUp = async (value: ISignUp) => {
	options.body = JSON.stringify(value)
	try {
		const response = await fetch(url + 'sign-up', options)
		const data = await response.json()

		if (response.ok) return { error: null }
		else return { error: data.message }
	} catch (error: any) {
		return { error: error }
	}
}

export const signOut = async () => {
	try {
		const response = await fetch(url + 'sign-out', options)
		const data = await response.json()

		if (response.ok) return { error: null }
		else return { error: data.message }
	} catch (error: any) {
		return { error: error }
	}
}

// обновление токена доступа
export const refresh = async () => {
	// options.body = JSON.stringify(value)
	try {
		const response = await fetch(url + 'refresh', options)
		const data = await response.json()

		if (response.ok) return { data: data, error: null }
		else return { data: null, error: data.message }
	} catch (error: any) {
		return { data: null, error: error }
	}
}

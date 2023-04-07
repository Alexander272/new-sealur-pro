import { IFeedback } from '@/types/feedback'

const url = '/api/v1/sealur-pro/connect/feedback'

let options: any = {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
}

export const sendFeedback = async (value: IFeedback) => {
	options.body = JSON.stringify(value)
	try {
		const response = await fetch(url, options)
		const data = await response.json()

		if (response.ok) return { error: null }
		else return { error: data.message }
	} catch (error: any) {
		return { error: error }
	}
}

import { Size } from '../constants/default'
import { IOrderParams } from '../types/order'

export const buildSiUrlParams = (req: IOrderParams): URLSearchParams => {
	const params = new URLSearchParams([])

	if (req.page && req.page != 1) params.append('page', req.page.toString())
	if (req.limit && req.limit != Size) params.append('size', req.limit.toString())

	if (req.sort) {
		const s = req.sort
		const sort: string[] = []
		Object.keys(s).forEach(k => {
			sort.push(`${s[k] == 'DESC' ? '-' : ''}${k}`)
		})
		params.append('sort_by', sort.join(','))
	}

	if (req.filters) {
		req.filters.forEach(f => {
			params.append(`filters[${f.field}]`, '')
			params.append(`${f.field}[${f.compareType}]`, f.value)
		})
	}

	return params
}

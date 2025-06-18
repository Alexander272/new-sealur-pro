import { useEffect } from 'react'

import type { ISizeErrors } from '../../../types/errors'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getSize, getSizeErrors, setSize, setSizeErrors, setThickness } from '../../../jacketedSlice'
import { Field } from './Field'
import { Thickness } from './Thickness'

export const Another = () => {
	const errors = useAppSelector(getSizeErrors)
	const sizes = useAppSelector(getSize)
	const dispatch = useAppDispatch()

	useEffect(() => {
		if (sizes.id != '') {
			dispatch(setSize({ id: '', dn: '', dnAlt: 0, pn: '', pnAlt: '', d4: '', d3: '', d2: '', d1: '' }))
			dispatch(setThickness('3.0'))
		}
	}, [dispatch, sizes])

	useEffect(() => {
		const err: ISizeErrors = {}
		err.d3 = sizes.d3 != '' && sizes.d2 != '' && +sizes.d3 <= +sizes.d2

		err.emptyD3 = !sizes.d3
		err.emptyD2 = !sizes.d2

		err.maxSize = 3504 < +sizes.d3

		const width = (+sizes.d3 - +sizes.d2) / 2
		err.minWidth = +sizes.d3 > 300 ? width < 9 : width < 5
		err.maxWidth = width > 30

		dispatch(setSizeErrors(err))
	}, [dispatch, sizes])

	const minWidth = errors.minWidth && 'Поле прокладки слишком маленькое'
	const maxWidth = errors.maxWidth && 'Поле прокладки слишком большое'

	return (
		<>
			<Field
				title='D2, мм'
				name='d3'
				errorText={
					(errors.emptyD3 && 'размер не задан') ||
					(errors.d3 && 'D2 должен быть больше, чем D1') ||
					(errors.maxSize && 'Прокладка слишком большая') ||
					minWidth ||
					maxWidth
				}
			/>
			<Field title='D1, мм' name='d2' errorText={errors.emptyD2 && 'размер не задан'} />

			<Thickness />
		</>
	)
}

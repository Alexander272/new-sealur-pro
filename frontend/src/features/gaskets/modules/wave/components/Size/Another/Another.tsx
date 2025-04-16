import { useEffect } from 'react'

import type { ISizeErrors } from '../../../types/errors'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getSize, getSizeErrors, getType, setSize, setSizeErrors } from '../../../waveSlice'
import { Thickness } from '../Thickness/Thickness'
import { Field } from './Field'

export const Another = () => {
	const type = useAppSelector(getType)
	const sizes = useAppSelector(getSize)
	const errors = useAppSelector(getSizeErrors)
	const dispatch = useAppDispatch()

	useEffect(() => {
		dispatch(setSize({ id: '', dn: '', pnMpa: '', pnKg: '', d4: '', d3: '', d2: '', d1: '' }))
	}, [dispatch, type])

	useEffect(() => {
		const err: ISizeErrors = {}
		err.d4 = sizes.d4 != '' && sizes.d3 != '' && (+sizes.d4 - +sizes.d3) / 2 < 1
		err.d3 = sizes.d3 != '' && sizes.d2 != '' && +sizes.d3 <= +sizes.d2
		err.d2 = sizes.d2 != '' && sizes.d1 != '' && (+sizes.d2 - +sizes.d1) / 2 < 1

		err.emptyD4 = (type?.hasD4 || false) && !sizes.d4
		err.emptyD3 = (type?.hasD3 || false) && !sizes.d3
		err.emptyD2 = (type?.hasD2 || false) && !sizes.d2
		err.emptyD1 = (type?.hasD1 || false) && !sizes.d1

		err.maxSize = 2000 < +sizes.d3

		if (type) {
			const width = (+sizes.d3 - +sizes.d2) / 2
			err.minWidth = width < 10
			err.maxWidth = width > 30
		}
		if (type?.hasD4 && type?.hasD1) {
			err.difD4D1 = (+sizes.d4 - +sizes.d1) / 2 >= 160
		}
		if (type?.hasD4 && !type?.hasD1) {
			err.difD4D2 = (+sizes.d4 - +sizes.d2) / 2 >= 140
		}
		if (!type?.hasD4 && type?.hasD1) {
			err.difD3D1 = (+sizes.d3 - +sizes.d1) / 2 >= 70
		}

		dispatch(setSizeErrors(err))
	}, [dispatch, sizes, type])

	const minWidth = errors.minWidth && 'Поле прокладки слишком маленькое'
	const maxWidth = errors.maxWidth && 'Поле прокладки слишком большое'

	return (
		<>
			{type?.hasD4 && (
				<Field
					title='D4, мм'
					name='d4'
					errorText={
						(errors.emptyD4 && 'размер не задан') ||
						(errors.d4 && 'D4 должен быть больше, чем D3 на 2 и более мм') ||
						(errors.difD4D1 && 'Разница между D4 и D1 должна быть меньше') ||
						(errors.difD4D2 && 'Разница между D4 и D2 должна быть меньше')
					}
				/>
			)}
			{type?.hasD3 && (
				<Field
					title='D3, мм'
					name='d3'
					errorText={
						(errors.emptyD3 && 'размер не задан') ||
						(errors.d3 && 'D3 должен быть больше, чем D2') ||
						(errors.maxSize && 'Прокладка слишком большая') ||
						minWidth ||
						maxWidth ||
						(errors.difD3D1 && 'Разница между D3 и D1 должна быть меньше')
					}
				/>
			)}
			{type?.hasD2 && (
				<Field
					title='D2, мм'
					name='d2'
					errorText={
						(errors.emptyD2 && 'размер не задан') ||
						(errors.d2 && 'D2 должен быть больше, чем D1 на 2 и более мм') ||
						minWidth ||
						maxWidth
					}
				/>
			)}
			{type?.hasD1 && <Field title='D1, мм' name='d1' errorText={errors.emptyD1 && 'размер не задан'} />}

			<Thickness />
		</>
	)
}

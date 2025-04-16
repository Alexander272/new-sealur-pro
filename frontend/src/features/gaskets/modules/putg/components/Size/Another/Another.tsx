import { useEffect } from 'react'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getConstruction, getSizeErr, setSizePn } from '../../../putgSlice'
import { Thickness } from '../Thickness/Thickness'
import { Field } from './Field'

export const Another = () => {
	const construction = useAppSelector(getConstruction)
	const errors = useAppSelector(getSizeErr)
	const dispatch = useAppDispatch()

	useEffect(() => {
		dispatch(setSizePn({ pn: { mpa: '', kg: '' }, pnIndex: -1 }))
	}, [dispatch])

	return (
		<>
			{construction?.hasD4 && (
				<Field
					title='D4, мм'
					name='d4'
					errorText={
						(errors.d4Err && 'D4 должен быть больше, чем D3') || (errors.emptyD4 && 'размер не задан')
					}
				/>
			)}
			{construction?.hasD3 && (
				<Field
					title='D3, мм'
					name='d3'
					errorText={
						(errors.emptyD3 && 'размер не задан') ||
						(errors.maxSize && 'Прокладка слишком большая для выбранной конструкции') ||
						(errors.d3Err && 'D3 должен быть больше, чем D2') ||
						(errors.minWidth && 'Поле прокладки слишком маленькое')
					}
				/>
			)}
			{construction?.hasD2 && (
				<Field
					title='D2, мм'
					name='d2'
					errorText={
						(errors.emptyD2 && 'размер не задан') ||
						(errors.d2Err && 'D2 должен быть больше, чем D1') ||
						(errors.minWidth && 'Поле прокладки слишком маленькое')
					}
				/>
			)}
			{construction?.hasD1 && <Field title='D1, мм' name='d1' errorText={errors.emptyD1 && 'размер не задан'} />}

			<Thickness />
		</>
	)
}

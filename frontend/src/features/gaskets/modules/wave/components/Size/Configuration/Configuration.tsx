import { useEffect } from 'react'

import type { ISizeErrors } from '../../../types/errors'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { useGetWaveTypesQuery } from '../../../waveApiSlice'
import {
	getConfiguration,
	getFlangeType,
	getSize,
	getSizeErrors,
	getType,
	getUseDimensions,
	setSize,
	setSizeErrors,
	setType,
} from '../../../waveSlice'
import { Field } from '../Another/Field'
import { Thickness } from '../Thickness/Thickness'
import { Dimensions } from './Dimensions'
import { Round } from './Round'

export const Configuration = () => {
	const configuration = useAppSelector(getConfiguration)
	const type = useAppSelector(getType)
	const flange = useAppSelector(getFlangeType)
	const useDimensions = useAppSelector(getUseDimensions)
	const sizes = useAppSelector(getSize)
	const errors = useAppSelector(getSizeErrors)
	const dispatch = useAppDispatch()

	const { data: types } = useGetWaveTypesQuery(flange?.id || '', { skip: !flange?.id })

	useEffect(() => {
		dispatch(setSize({ id: '', dn: '', pnMpa: '', pnKg: '', d4: '', d3: '', d2: '', d1: '' }))
	}, [dispatch])

	useEffect(() => {
		const err: ISizeErrors = {
			d4: false,
			d3: false,
			emptyD3: !sizes.d3,
			emptyD2: !sizes.d2,
			emptyD1: !sizes.d1,
		}

		if (sizes.useDimensions) {
			if (sizes.d4 != '' && (sizes.d3 != '' || sizes.d2 != '')) {
				err.d4 = +sizes.d4 <= +sizes.d3 || +sizes.d4 <= +sizes.d2
			}
			err.emptyD4 = !sizes.d4
		} else {
			if (sizes.d3 != '' && sizes.d2 != '') {
				err.d3 = +sizes.d3 <= +sizes.d2
			}
		}
		dispatch(setSizeErrors(err))
	}, [sizes, dispatch])
	useEffect(() => {
		if (!type) return
		let width = +sizes.d1
		if (sizes.useDimensions) {
			const width1 = (+sizes.d4 - +sizes.d3) / 2
			const width2 = (+sizes.d2 - +sizes.d1) / 2
			width = Math.min(width1, width2)
		}
		const err = width < type.widthRange[0] || width > type.widthRange[1]
		if (!err) return
		const newType = types?.data.find(f => width >= f.widthRange[0] && width <= f.widthRange[1])
		if (newType) dispatch(setType(newType))
	}, [types, type, sizes, dispatch])

	let A1Err = (errors.d3 && 'A1 должен быть больше, чем B1') || (errors.emptyD3 && 'размер не задан')
	if (useDimensions) {
		A1Err = (errors.d4 && 'A1 должен быть больше, чем A2 и B1') || (errors.emptyD4 && 'размер не задан')
	}

	return (
		<>
			<Dimensions />

			<Field
				title='A1, мм'
				name={useDimensions ? 'd4' : 'd3'}
				errorText={
					A1Err
					// ||
					// (errors.maxSize && 'Прокладка слишком большая') ||
					// (errors.minWidth && 'Поле прокладки слишком маленькое')
				}
			/>
			{useDimensions && (
				<Field
					title='A2, мм'
					name='d3'
					errorText={
						// (errors.minWidth && 'Поле прокладки слишком маленькое') ||
						errors.emptyD3 && 'размер не задан'
					}
				/>
			)}

			<Field
				title='B1, мм'
				name='d2'
				errorText={
					// (errors.minWidth && 'Поле прокладки слишком маленькое') ||
					(errors.d2 && 'B1 должен быть больше, чем B2') || (errors.emptyD2 && 'размер не задан')
				}
			/>

			<Field
				title={useDimensions ? 'B2, мм' : 'C, мм'}
				name='d1'
				errorText={
					// (errors.minWidth && 'Поле прокладки слишком маленькое') ||
					errors.emptyD1 && 'размер не задан'
				}
			/>

			<Thickness />
			{configuration?.code == 'rectangular' ? <Round /> : null}
		</>
	)
}

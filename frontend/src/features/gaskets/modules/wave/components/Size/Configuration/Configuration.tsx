import { useEffect } from 'react'

import type { ISizeErrors } from '../../../types/errors'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getConfiguration, getSize, getSizeErrors, getType, setSize, setSizeErrors } from '../../../waveSlice'
import { Field } from '../Another/Field'
import { Thickness } from '../Thickness/Thickness'
import { Round } from './Round'

export const Configuration = () => {
	const configuration = useAppSelector(getConfiguration)
	const type = useAppSelector(getType)
	const sizes = useAppSelector(getSize)
	const errors = useAppSelector(getSizeErrors)
	const dispatch = useAppDispatch()

	useEffect(() => {
		if (sizes.id != '') {
			dispatch(setSize({ id: '', dn: '', dnAlt: 0, pn: '', pnAlt: '', d4: '', d3: '', d2: '', d1: '' }))
		}
	}, [dispatch, sizes])

	useEffect(() => {
		const err: ISizeErrors = {
			d4: false,
			d3: false,
			emptyD3: !sizes.d3,
			emptyD2: !sizes.d2,
			emptyD1: !sizes.d1,
		}
		const width = +sizes.d1
		const maxWidth = +sizes.d1

		if (sizes.d3 != '' && sizes.d2 != '') {
			err.d3 = +sizes.d3 < +sizes.d2
		}
		err.maxSize = +sizes.d3 > 4100

		if (type) {
			err.minWidth = width < type?.widthRange[0]
			err.maxWidth = maxWidth > 100
		}
		dispatch(setSizeErrors(err))
	}, [sizes, dispatch, type])

	const A1Err = (errors.d3 && 'A1 должен быть больше, чем B1') || (errors.emptyD3 && 'размер не задан')

	const minWidth = errors.minWidth && 'Поле прокладки слишком маленькое'
	const maxWidth = errors.maxWidth && 'Поле прокладки слишком большое'

	return (
		<>
			<Field title='A1, мм' name={'d3'} errorText={A1Err || (errors.maxSize && 'Прокладка слишком большая')} />

			<Field
				title='B1, мм'
				name='d2'
				errorText={(errors.emptyD2 && 'размер не задан') || (errors.d2 && 'B1 должен быть больше, чем B2')}
			/>

			<Field
				title={'C, мм'}
				name='d1'
				errorText={(errors.emptyD1 && 'размер не задан') || minWidth || maxWidth}
			/>

			<Thickness />
			{configuration?.code == 'rectangular' ? <Round /> : null}
		</>
	)
}

import { useAppSelector } from '@/hooks/redux'
import { getConfiguration, getSizeErr, getUseDimensions } from '../../../putgSlice'
import { Dimensions } from './Dimensions'
import { Field } from '../Another/Field'
import { Thickness } from '../Thickness/Thickness'
import { Round } from './Round'

export const Configuration = () => {
	const configuration = useAppSelector(getConfiguration)
	const useDimensions = useAppSelector(getUseDimensions)
	const errors = useAppSelector(getSizeErr)

	let A1Err = (errors.d3Err && 'A1 должен быть больше, чем B1') || (errors.emptyD3 && 'размер не задан')
	if (useDimensions) {
		A1Err = (errors.d4Err && 'A1 должен быть больше, чем A2 и B1') || (errors.emptyD4 && 'размер не задан')
	}

	return (
		<>
			<Dimensions />

			<Field
				title='A1, мм'
				name={useDimensions ? 'd4' : 'd3'}
				errorText={
					A1Err ||
					(errors.maxSize && 'Прокладка слишком большая') ||
					(errors.minWidth && 'Поле прокладки слишком маленькое')
				}
			/>
			{useDimensions && (
				<Field
					title='A2, мм'
					name='d3'
					errorText={
						(errors.minWidth && 'Поле прокладки слишком маленькое') || (errors.emptyD3 && 'размер не задан')
					}
				/>
			)}

			<Field
				title='B1, мм'
				name='d2'
				errorText={
					(errors.minWidth && 'Поле прокладки слишком маленькое') ||
					(errors.d2Err && 'B1 должен быть больше, чем B2') ||
					(errors.emptyD2 && 'размер не задан')
				}
			/>

			<Field
				title={useDimensions ? 'B2, мм' : 'C, мм'}
				name='d1'
				errorText={
					(errors.minWidth && 'Поле прокладки слишком маленькое') || (errors.emptyD1 && 'размер не задан')
				}
			/>

			<Thickness />
			{configuration?.code == 'rectangular' ? <Round /> : null}
		</>
	)
}

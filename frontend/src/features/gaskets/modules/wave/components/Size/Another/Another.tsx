import { useAppSelector } from '@/hooks/redux'
import { Thickness } from '../Thickness/Thickness'
import { getSizeErrors, getType } from '../../../waveSlice'
import { Field } from './Field'

export const Another = () => {
	const type = useAppSelector(getType)
	const errors = useAppSelector(getSizeErrors)
	// const dispatch = useAppDispatch()

	// useEffect(() => {
	// 	dispatch(setSizePn({ pn: { mpa: '', kg: '' }, pnIndex: -1 }))
	// }, [dispatch])

	return (
		<>
			{type?.hasD4 && (
				<Field
					title='D4, мм'
					name='d4'
					errorText={(errors.d4 && 'D4 должен быть больше, чем D3') || (errors.emptyD4 && 'размер не задан')}
				/>
			)}
			{type?.hasD3 && (
				<Field
					title='D3, мм'
					name='d3'
					errorText={
						(errors.maxSize && 'Прокладка слишком большая для выбранной конструкции') ||
						(errors.minWidth && 'Поле прокладки слишком маленькое') ||
						(errors.d3 && 'D3 должен быть больше, чем D2') ||
						(errors.emptyD3 && 'размер не задан')
					}
				/>
			)}
			{type?.hasD2 && (
				<Field
					title='D2, мм'
					name='d2'
					errorText={
						(errors.minWidth && 'Поле прокладки слишком маленькое') ||
						(errors.d2 && 'D2 должен быть больше, чем D1') ||
						(errors.emptyD2 && 'размер не задан')
					}
				/>
			)}
			{type?.hasD1 && <Field title='D1, мм' name='d1' errorText={errors.emptyD1 && 'размер не задан'} />}

			<Thickness />
		</>
	)
}

import { useAppSelector } from '@/hooks/redux'
import { Field } from './Field'
import { Thickness } from './Thickness'
import { getSizeErrors } from '../../../jacketedSlice'

export const Another = () => {
	const errors = useAppSelector(getSizeErrors)

	const minWidth = errors.minWidth && 'Поле прокладки слишком маленькое'
	const maxWidth = errors.maxWidth && 'Поле прокладки слишком большое'

	return (
		<>
			<Field
				title='D2, мм'
				name='d3'
				errorText={
					(errors.emptyD3 && 'размер не задан') ||
					(errors.d3 && 'D2 должен быть больше, чем D1 на 2 и более мм') ||
					minWidth ||
					maxWidth
				}
			/>
			<Field title='D1, мм' name='d2' errorText={errors.emptyD2 && 'размер не задан'} />

			<Thickness />
		</>
	)
}

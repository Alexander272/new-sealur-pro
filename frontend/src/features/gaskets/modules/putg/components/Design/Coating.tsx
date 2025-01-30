import { ChangeEvent, FC } from 'react'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { Checkbox } from '@/components/Checkbox/Checkbox'
import { getHasCoating, setHasCoating } from '../../putgSlice'

type Props = {
	disabled?: boolean
}

export const Coating: FC<Props> = ({ disabled }) => {
	const hasCoating = useAppSelector(getHasCoating)

	const dispatch = useAppDispatch()

	const coatingHandler = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(setHasCoating(event.target.checked))
	}

	return (
		<Checkbox
			id='coating'
			name='coating'
			label='Самоклеящееся покрытие'
			checked={hasCoating}
			disabled={disabled}
			onChange={coatingHandler}
		/>
	)
}

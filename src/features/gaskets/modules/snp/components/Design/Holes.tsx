import { ChangeEvent, FC } from 'react'

import { Checkbox } from '@/components/Checkbox/Checkbox'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getHasHole, setHasHole } from '../../snpSlice'

type Props = {
	disabled?: boolean
}

export const Holes: FC<Props> = ({ disabled }) => {
	const hasHole = useAppSelector(getHasHole)

	const dispatch = useAppDispatch()

	const holeHandler = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(setHasHole(event.target.checked))
	}

	return (
		<Checkbox
			id='holes'
			name='holes'
			label='Отверстия в наруж. ограничителе'
			checked={hasHole}
			disabled={disabled}
			onChange={holeHandler}
		/>
	)
}

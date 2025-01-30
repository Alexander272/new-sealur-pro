import { ChangeEvent } from 'react'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { Checkbox } from '@/components/Checkbox/Checkbox'
import { getSizes, setHasRounding } from '../../../putgSlice'

export const Round = () => {
	const size = useAppSelector(getSizes)
	const dispatch = useAppDispatch()

	const roundingHandler = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(setHasRounding(event.target.checked))
	}

	return (
		<Checkbox
			id={'hasRounding'}
			name={'hasRounding'}
			checked={size.hasRounding || false}
			onChange={roundingHandler}
			label='Есть скругления'
		/>
	)
}

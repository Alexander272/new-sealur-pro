import { ChangeEvent } from 'react'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { Checkbox } from '@/components/Checkbox/Checkbox'
import { getHasRounding, setHasRounding } from '../../../waveSlice'

export const Round = () => {
	const hasRounding = useAppSelector(getHasRounding)
	const dispatch = useAppDispatch()

	const roundingHandler = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(setHasRounding(event.target.checked))
	}

	return (
		<Checkbox
			id={'hasRounding'}
			name={'hasRounding'}
			checked={hasRounding || false}
			onChange={roundingHandler}
			label='Есть скругления'
		/>
	)
}

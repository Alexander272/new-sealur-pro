import { ChangeEvent, FC } from 'react'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { Checkbox } from '@/components/Checkbox/Checkbox'
import { getWithRetainer, setWithRetainer } from '../../waveSlice'

type Props = {
	disabled?: boolean
}

export const Retainer: FC<Props> = ({ disabled }) => {
	const withRetainer = useAppSelector(getWithRetainer)

	const dispatch = useAppDispatch()

	const retainerHandler = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(setWithRetainer(event.target.checked))
	}

	return (
		<Checkbox
			id='retainer'
			name='withRetainer'
			label='С дополнительным крепежом формы Ф1'
			checked={withRetainer || false}
			disabled={disabled}
			onChange={retainerHandler}
		/>
	)
}

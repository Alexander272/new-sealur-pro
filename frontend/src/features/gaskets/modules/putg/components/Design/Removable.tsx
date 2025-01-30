import { ChangeEvent, FC } from 'react'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { Checkbox } from '@/components/Checkbox/Checkbox'
import { getHasRemovable, getSizes, setHasRemovable } from '../../putgSlice'

type Props = {
	disabled?: boolean
}

export const Removable: FC<Props> = ({ disabled }) => {
	const hasRemovable = useAppSelector(getHasRemovable)
	const sizes = useAppSelector(getSizes)
	const dispatch = useAppDispatch()

	const removableHandler = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(setHasRemovable(event.target.checked))
	}

	return (
		<Checkbox
			id='removable'
			name='removable'
			label='Разъемная'
			checked={hasRemovable}
			disabled={disabled || +sizes.d3 >= 2000}
			onChange={removableHandler}
		/>
	)
}

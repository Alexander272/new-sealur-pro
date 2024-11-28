import { ChangeEvent, FC, useEffect, useState } from 'react'
import { Stack } from '@mui/material'

import type { IMainJumper } from '@/features/gaskets/types/jumper'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { Checkbox } from '@/components/Checkbox/Checkbox'
import { JumperSelect } from '@/components/Jumper/Jumper'
import { Input } from '@/components/Input/input.style'
import { getJumper, setDesignJumper } from '../../snpSlice'
import { useDebounce } from '@/hooks/debounce'

type Props = {
	disabled?: boolean
}

export const Jumper: FC<Props> = ({ disabled }) => {
	const [value, setValue] = useState('')

	const jumper = useAppSelector(getJumper)

	const dispatch = useAppDispatch()

	const debounced = useDebounce(value, 500)

	useEffect(() => {
		dispatch(setDesignJumper({ width: value }))
	}, [debounced, dispatch, value])

	const jumperHandler = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(setDesignJumper({ hasJumper: event.target.checked }))
	}
	const jumperSelectHandler = (jumper: IMainJumper) => {
		dispatch(setDesignJumper({ code: jumper.code, hasDrawing: jumper.hasDrawing }))
	}
	const jumperWidthHandler = (event: ChangeEvent<HTMLInputElement>) => {
		const regex = /(^\d*)?$/
		if (regex.test(event.target.value)) setValue(event.target.value)

		// const regex = /^[0-9\b]+$/
		// if (event.target.value === '' || regex.test(event.target.value)) {
		// 	let value: number | string = +event.target.value
		// 	if (event.target.value === '') value = event.target.value
		// 	dispatch(setDesignJumper({ width: value.toString() }))
		// }
	}

	return (
		<Stack direction='row' spacing={2} marginBottom={1}>
			<Checkbox
				id='jumper'
				name='jumper'
				label='Перемычка'
				checked={jumper.hasJumper}
				disabled={disabled}
				onChange={jumperHandler}
			/>

			{jumper.hasJumper && (
				<>
					<JumperSelect value={jumper.code} onSelect={jumperSelectHandler} />
					<Input
						value={value}
						onChange={jumperWidthHandler}
						disabled={disabled}
						placeholder='Ширина перемычки'
					/>
				</>
			)}
		</Stack>
	)
}

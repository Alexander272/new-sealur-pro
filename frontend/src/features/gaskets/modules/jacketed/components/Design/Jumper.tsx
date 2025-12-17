import { ChangeEvent, FC, useEffect, useState } from 'react'
import { Stack } from '@mui/material'

import type { IMainJumper } from '@/features/gaskets/types/jumper'
import { useDebounce } from '@/hooks/debounce'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getJumper, getSizeErrors, setJumper } from '../../jacketedSlice'
import { Checkbox } from '@/components/Checkbox/Checkbox'
import { JumperSelect } from '@/components/Jumper/Jumper'
import { Input } from '@/components/Input/input.style'

type Props = {
	disabled?: boolean
}

export const Jumper: FC<Props> = ({ disabled }) => {
	const sizeError = useAppSelector(getSizeErrors)
	const jumper = useAppSelector(getJumper)
	const [value, setValue] = useState(jumper.width)

	const dispatch = useAppDispatch()

	const debounced = useDebounce(value, 500)

	useEffect(() => {
		dispatch(setJumper({ width: value }))
	}, [debounced, dispatch, value])
	useEffect(() => {
		if (!jumper.hasJumper) setValue('')
	}, [jumper])

	const jumperHandler = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(setJumper({ hasJumper: event.target.checked }))
	}
	const jumperSelectHandler = (jumper: IMainJumper) => {
		dispatch(setJumper({ code: jumper.code, hasDrawing: jumper.hasDrawing }))
		if (jumper.code == 'M') setValue('')
	}
	const jumperWidthHandler = (event: ChangeEvent<HTMLInputElement>) => {
		const regex = /(^\d{1,4}([.,](\d{1,2})?)?)$/
		if (regex.test(event.target.value)) setValue(event.target.value)
		if (event.target.value === '') setValue(event.target.value)
	}

	return (
		<Stack direction='row' spacing={2} marginBottom={3} alignItems={'flex-start'}>
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
						disabled={disabled || jumper.code == 'M'}
						placeholder='Ширина перемычки, мм'
						error={sizeError.jumper}
						helperText={sizeError.jumper && 'Неверная ширина перемычки'}
					/>
				</>
			)}
		</Stack>
	)
}

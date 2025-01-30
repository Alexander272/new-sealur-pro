import { ChangeEvent, FC, useEffect, useState } from 'react'
import { Stack } from '@mui/material'

import type { IMainJumper } from '@/features/gaskets/types/jumper'
import { useDebounce } from '@/hooks/debounce'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { Checkbox } from '@/components/Checkbox/Checkbox'
import { JumperSelect } from '@/components/Jumper/Jumper'
import { Input } from '@/components/Input/input.style'
import { getConstruction, getJumper, getSizes, setDesignJumper } from '../../putgSlice'

type Props = {
	disabled?: boolean
}

export const Jumper: FC<Props> = ({ disabled }) => {
	const [value, setValue] = useState('')

	const construction = useAppSelector(getConstruction)
	const sizes = useAppSelector(getSizes)
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
		const regex = /(^\d{1,3})$/
		if (regex.test(event.target.value)) setValue(event.target.value)
		if (event.target.value === '') setValue(event.target.value)
	}

	const jumperInRange = () => {
		if (!construction) return false

		if (+sizes.d2 >= construction.jumperRange[0] && construction.jumperRange[1] == -1) return true
		if (+sizes.d2 >= construction.jumperRange[0] && +sizes.d2 < construction.jumperRange[1]) return true

		return false
	}
	const jumperDisable = !jumperInRange()

	return (
		<Stack direction='row' spacing={2} marginBottom={3}>
			<Checkbox
				id='jumper'
				name='jumper'
				label='Перемычка'
				checked={jumper.hasJumper}
				disabled={disabled || jumperDisable}
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

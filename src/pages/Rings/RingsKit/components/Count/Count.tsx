import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'
import { Stack, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { toggleActiveStep } from '@/store/rings/kit'
import { Step } from '@/pages/Rings/components/Step/Step'
import { Input } from '@/components/Input/input.style'

export const Count = () => {
	const count = useAppSelector(state => state.kit.count)

	const step = useAppSelector(state => state.kit.countStep)

	const baseRef = useRef<HTMLInputElement | null>(null)

	const [baseRings, setBaseRings] = useState('')
	const [endRings, setEndRings] = useState('')

	const dispatch = useAppDispatch()

	useEffect(() => {
		const parts = count.split('×')
		setEndRings(parts[0])
		setBaseRings(parts[1])
	}, [count])

	const toggleHandler = () => dispatch(toggleActiveStep('countStep'))

	const sizeHandler = (event: ChangeEvent<HTMLInputElement>) => {
		const temp = event.target.value.replace(',', '.')
		if (temp === '' || !isNaN(+temp)) {
			if (temp[temp.length - 1] == '.') return
			// let value: string
			// if (temp[temp.length - 1] == '.') value = temp
			// else value = (Math.trunc(+temp * 10) / 10).toString()

			const name = (event.target as HTMLInputElement).name
			if (name == 'end_rings') setEndRings(temp)
			if (name == 'base_rings') setBaseRings(temp)
			if (name == 'only_base_ring') setEndRings(temp)
		}
	}

	const keyHandler = (event: KeyboardEvent<HTMLInputElement>) => {
		const name = (event.target as HTMLInputElement).name
		if (name != 'base_rings' && name != 'only_base_ring' && event.code == 'Tab') {
			event.stopPropagation()
		}

		if (event.code == 'Enter' || event.code == 'NumpadEnter') {
			if (name == 'end_rings') {
				;(baseRef.current?.firstChild as HTMLLabelElement).focus()
			} else {
				dispatch(toggleActiveStep('countStep'))
			}
		}
	}

	return (
		<Step label={count || '0×0'} step={step} toggle={toggleHandler}>
			<Stack direction={'row'} spacing={1} maxWidth={'500px'} width={'100%'} margin={1}>
				{count.includes('×') ? (
					<>
						<Input
							value={endRings}
							onChange={sizeHandler}
							onKeyDown={keyHandler}
							name='end_rings'
							label='Кол-во замыкающих колец'
							size='small'
							// error={sizeError}
							// helperText={sizeError && 'Нар. диаметр должен быть > Вн. диаметра'}
						/>
						<Typography pt={1}>×</Typography>
						<Input
							value={baseRings}
							onChange={sizeHandler}
							onKeyDown={keyHandler}
							ref={baseRef}
							name='base_rings'
							label='Кол-во основных колец'
							size='small'
							// error={sizeError}
							// helperText={sizeError && 'Нар. диаметр должен быть > Вн. диаметра'}
						/>
					</>
				) : (
					<Input
						value={endRings}
						onChange={sizeHandler}
						onKeyDown={keyHandler}
						name='only_base_ring'
						label='Кол-во основных колец'
						size='small'
						// error={sizeError}
						// helperText={sizeError && 'Нар. диаметр должен быть > Вн. диаметра'}
					/>
				)}
			</Stack>
		</Step>
	)
}

import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'
import { Stack, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { setCount, toggleActiveStep } from '@/store/rings/kit'
import { Step } from '@/pages/Rings/components/Step/Step'
import { Input } from '@/components/Input/input.style'
import { useDebounce } from '@/hooks/debounce'

const titles = ['Кол-во замыкающих колец', 'Кол-во предкрайних колец', 'Кол-во основных колец']

export const Count = () => {
	const construction = useAppSelector(state => state.kit.construction)
	const count = useAppSelector(state => state.kit.count)

	const step = useAppSelector(state => state.kit.countStep)

	const baseRef = useRef<HTMLInputElement | null>(null)

	const [baseRings, setBaseRings] = useState('')
	const [marRings, setMarRings] = useState('')
	const [endRings, setEndRings] = useState('')

	const base = useDebounce(baseRings, 500)
	const mar = useDebounce(marRings, 500)
	const end = useDebounce(endRings, 500)

	const dispatch = useAppDispatch()

	useEffect(() => {
		const parts = count.split('×')
		if (parts.length > 2) {
			setEndRings(parts[0])
			setMarRings(parts[1])
			setBaseRings(parts[2])
		} else {
			setEndRings(parts[0])
			setBaseRings(parts[1])
		}
	}, [count])

	useEffect(() => {
		const c = construction?.defaultCount.split('×').length || 1
		dispatch(setCount(`${end || 0}${c > 2 ? `×${mar || 0}` : ''}${c > 1 ? `×${base || 0}` : ''}`))
	}, [base, mar, end])

	const toggleHandler = () => dispatch(toggleActiveStep('countStep'))

	const countHandler = (event: ChangeEvent<HTMLInputElement>) => {
		const temp = event.target.value.replace(',', '.')
		if (temp === '' || !isNaN(+temp)) {
			if (temp[temp.length - 1] == '.') return

			const name = (event.target as HTMLInputElement).name
			if (name == 'end_rings') setEndRings(temp)
			if (name == 'base_rings') setBaseRings(temp)
			if (name == 'mar_rings') setMarRings(temp)
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
			<Stack
				direction={'row'}
				spacing={1}
				maxWidth={`${count.split('×').length * 250}px`}
				width={'100%'}
				margin={1}
			>
				{count.includes('×') ? (
					<>
						<Input
							value={endRings}
							onChange={countHandler}
							onKeyDown={keyHandler}
							name='end_rings'
							label={titles[0]}
							size='small'
							// error={sizeError}
							// helperText={sizeError && 'Нар. диаметр должен быть > Вн. диаметра'}
						/>
						{(construction?.defaultCount.split('×').length || 1) > 2 && (
							<>
								<Typography pt={1}>×</Typography>
								<Input
									value={marRings}
									onChange={countHandler}
									onKeyDown={keyHandler}
									name='mar_rings'
									label={titles[1]}
									size='small'
								/>
							</>
						)}
						<Typography pt={1}>×</Typography>
						<Input
							value={baseRings}
							onChange={countHandler}
							onKeyDown={keyHandler}
							ref={baseRef}
							name='base_rings'
							label={titles[2]}
							size='small'
							// error={sizeError}
							// helperText={sizeError && 'Нар. диаметр должен быть > Вн. диаметра'}
						/>
					</>
				) : (
					<Input
						value={endRings}
						onChange={countHandler}
						onKeyDown={keyHandler}
						name='only_base_ring'
						label={titles[2]}
						size='small'
						// error={sizeError}
						// helperText={sizeError && 'Нар. диаметр должен быть > Вн. диаметра'}
					/>
				)}
			</Stack>
		</Step>
	)
}

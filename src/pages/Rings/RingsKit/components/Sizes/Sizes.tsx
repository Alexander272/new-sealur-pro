import { ChangeEvent, KeyboardEvent, MouseEvent, useEffect, useRef, useState } from 'react'
import { List, ListItemButton, Stack, Typography } from '@mui/material'
import { useDebounce } from '@/hooks/debounce'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { setSize, setStep, setThickness, toggleActiveStep } from '@/store/rings/kit'
import { useGetSizeKitQuery } from '@/store/api/rings'
import { Step } from '@/pages/Rings/components/Step/Step'
import { Input } from '@/components/Input/input.style'

export const Sizes = () => {
	const construction = useAppSelector(state => state.kit.construction)
	const size = useAppSelector(state => state.kit.sizes)
	const thickness = useAppSelector(state => state.kit.thickness)

	const sizeErr = useAppSelector(state => state.kit.sizeError)

	const step = useAppSelector(state => state.kit.sizeStep)

	const [d3, setD3] = useState('')
	const [d2, setD2] = useState('')
	const [h, setH] = useState('')

	const d2Ref = useRef<HTMLInputElement | null>(null)
	const hRef = useRef<HTMLInputElement | null>(null)

	const D3 = useDebounce(d3, 500)
	const D2 = useDebounce(d2, 500)
	const thick = useDebounce(h, 500)

	const { data, isLoading, isError } = useGetSizeKitQuery(construction?.id || '', { skip: !construction?.id })

	const dispatch = useAppDispatch()

	useEffect(() => {
		const parts = size?.split('×') || []
		setD3(parts[0] != '00' ? parts[0] || '' : '')
		setD2(parts[1] != '00' ? parts[1] || '' : '')
	}, [size])
	useEffect(() => {
		setH(thickness || '')
	}, [thickness])

	useEffect(() => {
		dispatch(setSize(`${D3 || '00'}×${D2 || '00'}`))

		if (construction?.hasThickness && thick != '') {
			dispatch(setThickness(thick))
		}

		let ok = D3 != '0' && D3 != '' && D2 != '0' && D2 != ''
		ok = ok && (!construction?.hasThickness || (Boolean(thick) && thick != '0'))
		ok = ok && +D3 > +D2
		if (ok) {
			dispatch(setStep({ step: 'sizeStep', complete: true }))
		} else {
			dispatch(setStep({ step: 'sizeStep', complete: false }))
		}
	}, [D3, D2, thick])

	const toggleHandler = () => dispatch(toggleActiveStep('sizeStep'))

	const selectSizeHandler = (event: MouseEvent<HTMLDivElement>) => {
		const { size } = (event.target as HTMLDivElement).dataset
		if (!size) return

		const parts = size.split('×')

		setD3(parts[0])
		setD2(parts[1])
		setH(parts[2])
	}

	const sizeHandler = (event: ChangeEvent<HTMLInputElement>) => {
		const temp = event.target.value.replace(',', '.')
		const name = (event.target as HTMLInputElement).name

		if (temp === '' || !isNaN(+temp)) {
			// if (temp[temp.length - 1] == '.') return
			let value = ''

			if (temp != '') {
				if (temp[temp.length - 1] == '.') value = temp
				else value = (Math.trunc(+temp * 10) / 10).toString()
			}

			if (name == 'kit_d3') setD3(value)
			if (name == 'kit_d2') setD2(value)
			if (name == 'kit_h') setH(value)
		}
	}

	const keyHandler = (event: KeyboardEvent<HTMLInputElement>) => {
		const name = (event.target as HTMLInputElement).name

		if (name != 'h' && event.code == 'Tab') {
			event.stopPropagation()
		}

		if (event.code == 'Enter' || event.code == 'NumpadEnter') {
			if (name == 'kit_d3') {
				;(d2Ref.current?.firstChild as HTMLLabelElement).focus()
			}
			if (name == 'kit_d2') {
				if (construction?.hasThickness) {
					;(hRef.current?.firstChild as HTMLLabelElement).focus()
				} else dispatch(toggleActiveStep('sizeStep'))
			}
			if (name == 'kit_h') {
				dispatch(toggleActiveStep('sizeStep'))
			}
		}
	}

	return (
		<Step
			label={(size || '00×00') + (!construction?.hasThickness ? '' : '×' + (thickness || '0'))}
			step={step}
			disabled={isLoading}
			toggle={toggleHandler}
		>
			<Stack spacing={2} m={1}>
				<Stack direction={'row'} spacing={1} maxWidth={'550px'} width={'100%'}>
					<Input
						value={d3}
						onChange={sizeHandler}
						onKeyDown={keyHandler}
						name='kit_d3'
						label='Нар. диаметр, мм'
						autoFocus
						size='small'
						error={sizeErr}
						helperText={sizeErr && 'Нар. диаметр должен быть > Вн. диаметра'}
					/>
					<Typography pt={1}>×</Typography>
					<Input
						value={d2}
						onChange={sizeHandler}
						onKeyDown={keyHandler}
						ref={d2Ref}
						name='kit_d2'
						label='Вн. диаметр, мм'
						size='small'
						error={sizeErr}
						helperText={sizeErr && 'Нар. диаметр должен быть > Вн. диаметра'}
					/>

					{construction?.hasThickness && (
						<>
							<Typography pt={1}>×</Typography>
							<Input
								value={h}
								onChange={sizeHandler}
								onKeyDown={keyHandler}
								ref={hRef}
								name='kit_h'
								label='Высота, мм'
								size='small'
								// error={thicknessError}
								// helperText={thicknessError && 'Высота кольца должна быть ≥ 1,5 мм'}
							/>
						</>
					)}
				</Stack>

				{isError && (
					<Typography paddingX={2} variant='h6' color={'error'} align='center'>
						Не удалось загрузить данные
					</Typography>
				)}

				{data?.data?.sizes?.length ? (
					<List sx={{ maxHeight: 400, overflow: 'auto' }}>
						{data.data.sizes
							.filter(s => d3 == '' || s.outer.toString().includes(d3))
							.map(s => (
								<ListItemButton
									key={s.id}
									sx={{ borderRadius: '12px' }}
									data-size={`${s.outer}×${s.inner}×${s.thickness}`}
									selected={`${s.outer}×${s.inner}×${s.thickness}` == `${d3}×${d2}×${h}`}
									onClick={selectSizeHandler}
								>
									{s.outer}×{s.inner}×{s.thickness}
								</ListItemButton>
							))}
					</List>
				) : null}
			</Stack>
		</Step>
	)
}

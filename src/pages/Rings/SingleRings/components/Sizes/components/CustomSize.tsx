import { ChangeEvent, FC, KeyboardEvent, MouseEvent, useEffect, useRef, useState } from 'react'
import { Box, ListItemButton, Stack, Typography } from '@mui/material'
import { FixedSizeList, ListChildComponentProps } from 'react-window'
import { useDebounce } from '@/hooks/debounce'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { setSize, setThickness, toggleActiveStep } from '@/store/rings/ring'
import type { IRingSize } from '@/types/rings'
import { Input } from '@/components/Input/input.style'

type Props = {
	sizes: IRingSize[]
	hasThickness?: boolean
}

export const CustomSize: FC<Props> = ({ sizes, hasThickness }) => {
	const size = useAppSelector(state => state.ring.sizes)
	const thickness = useAppSelector(state => state.ring.thickness)

	const sizeError = useAppSelector(state => state.ring.sizeError)
	const thicknessError = useAppSelector(state => state.ring.thicknessError)

	const [d3, setD3] = useState<string>(size?.split('×')[0] != '00' ? size?.split('×')[0] || '' : '')
	const [d2, setD2] = useState<string>(size?.split('×')[1] != '00' ? size?.split('×')[1] || '' : '')
	const [h, setH] = useState<string>(thickness || '')

	// const [hasForm, setHasForm] = useState(true)

	const d2Ref = useRef<HTMLInputElement | null>(null)
	const hRef = useRef<HTMLInputElement | null>(null)

	const listRef = useRef<FixedSizeList | null>(null)

	const D3 = useDebounce(d3, 500)
	const D2 = useDebounce(d2, 500)
	const thick = useDebounce(h, 500)

	const dispatch = useAppDispatch()

	useEffect(() => {
		dispatch(setSize(`${D3 || '00'}×${D2 || '00'}`))

		if (!D3 || !D2) return
		const foundSize = sizes.find(s => s.outer.toString() == D3 && s.inner.toString() == D2)

		if (foundSize) {
			// setHasForm(true)
			setH(foundSize.thickness.toString())
			dispatch(setThickness(foundSize.thickness.toString()))
		} else {
			// setHasForm(false)
			if (hasThickness) {
				setH(Math.ceil((+d3 - +d2) / 2).toString())
				dispatch(setThickness(Math.ceil((+d3 - +d2) / 2).toString()))
			}
		}
	}, [D3, D2])
	useEffect(() => {
		if (thick != '') dispatch(setThickness(thick || '0'))
	}, [thick])

	useEffect(() => {
		let idx = sizes?.findIndex(s => s.outer == +d3)

		if (idx == -1) idx = sizes?.findIndex(s => s.outer >= +d3 - 3)
		if (idx == undefined || idx == -1) return

		listRef.current?.scrollToItem(idx, 'start')
		// listRef.current?.scroll({ top: (child as HTMLLIElement).offsetTop, behavior: 'smooth' })
	}, [d3])

	const selectSizeHandler = (event: MouseEvent<HTMLDivElement>) => {
		const { size } = (event.target as HTMLDivElement).dataset
		if (!size) return

		const parts = size.split('×')

		setD3(parts[0])
		setD2(parts[1])
		setH(parts[2])
	}

	const sizeHandler = (type: 'd3' | 'd2' | 'h') => (event: ChangeEvent<HTMLInputElement>) => {
		const temp = event.target.value.replace(',', '.')

		if (temp === '' || !isNaN(+temp)) {
			// if (temp[temp.length - 1] == '.') return
			let value = ''

			if (temp != '') {
				if (temp[temp.length - 1] == '.') value = temp
				else value = (Math.trunc(+temp * 10) / 10).toString()
			}

			if (type == 'd3') setD3(value)
			if (type == 'd2') setD2(value)
			if (type == 'h') setH(value)
		}
	}

	const keyHandler = (type: 'd3' | 'd2' | 'h') => (event: KeyboardEvent<HTMLInputElement>) => {
		if (type != 'h' && event.code == 'Tab') {
			event.stopPropagation()
		}

		if (event.code == 'Enter' || event.code == 'NumpadEnter') {
			if (type == 'd3') {
				;(d2Ref.current?.firstChild as HTMLLabelElement).focus()
			}
			if (type == 'd2') {
				if (hasThickness) {
					;(hRef.current?.firstChild as HTMLLabelElement).focus()
				} else dispatch(toggleActiveStep('sizeStep'))
			}
			if (type == 'h') {
				dispatch(toggleActiveStep('sizeStep'))
			}
		}
	}

	const closeStep = () => dispatch(toggleActiveStep('sizeStep'))

	function renderRow(props: ListChildComponentProps) {
		const { index, style } = props
		const s = sizes[index]

		return (
			<ListItemButton
				key={s.id}
				data-size={`${s.outer}×${s.inner}×${Math.ceil((s.outer - s.inner) / 2)}`}
				selected={`${s.outer}×${s.inner}` == `${d3}×${d2}`}
				onClick={selectSizeHandler}
				onDoubleClick={closeStep}
				style={style}
				sx={{ borderRadius: '12px' }}
			>
				{s.outer}×{s.inner}×{s.thickness}
			</ListItemButton>
		)
	}

	return (
		<Box margin={1}>
			<Stack direction={'row'} spacing={1} mb={1} maxWidth={'550px'} width={'100%'}>
				<Input
					value={d3}
					onChange={sizeHandler('d3')}
					onKeyDown={keyHandler('d3')}
					name='ring_d3'
					label='Нар. диаметр, мм'
					size='small'
					autoFocus
					error={sizeError}
					helperText={sizeError && 'Нар. диаметр должен быть > Вн. диаметра'}
				/>
				<Typography pt={1}>×</Typography>
				<Input
					value={d2}
					onChange={sizeHandler('d2')}
					onKeyDown={keyHandler('d2')}
					ref={d2Ref}
					name='ring_d2'
					label='Вн. диаметр, мм'
					size='small'
					error={sizeError}
					helperText={sizeError && 'Нар. диаметр должен быть > Вн. диаметра'}
				/>

				{hasThickness && (
					<>
						<Typography pt={1}>×</Typography>
						<Input
							value={h}
							onChange={sizeHandler('h')}
							onKeyDown={keyHandler('h')}
							ref={hRef}
							name='ring_h'
							label='Высота, мм'
							size='small'
							error={thicknessError}
							helperText={thicknessError && 'Высота кольца должна быть ≥ 1,5 мм'}
						/>
					</>
				)}
			</Stack>

			<Box>
				{sizes.length ? (
					<>
						<Typography maxWidth={'550px'} align='justify' paddingX={2} paddingTop={1}>
							Список готовых пресс-форм
						</Typography>
						<FixedSizeList
							ref={listRef}
							height={400}
							width={'100%'}
							itemSize={40}
							itemCount={sizes?.length || 100}
							overscanCount={5}
						>
							{renderRow}
						</FixedSizeList>
					</>
				) : null}
				{/* {!hasForm && sizes.length ? (
					<>
						<Typography maxWidth={'550px'} align='justify' padding={1}>
							По указанным размерам пресс-формы нет, рекомендуем выбрать из нижеперечисленных, либо в счет
							будет дополнительно включено изготовление пресс-формы.
						</Typography>
						<List>
							{sizes
								.filter(
									s =>
										(s.outer + 1 >= +d3 && s.outer - 1 <= +d3 && Math.trunc(s.inner) == +d2) ||
										(s.inner + 1 >= +d2 && s.inner - 1 <= +d2 && Math.trunc(s.outer) == +d3)
								)
								.map(s => (
									<ListItemButton
										key={s.id}
										sx={{ borderRadius: '12px' }}
										data-size={`${s.outer}×${s.inner}×${Math.ceil((s.outer - s.inner) / 2)}`}
										onClick={selectSizeHandler}
									>
										{s.outer}×{s.inner}
									</ListItemButton>
								))}
						</List>
					</>
				) : null} */}
			</Box>
		</Box>
	)
}

import { ChangeEvent, FC, useEffect, useState } from 'react'
import { MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { setSize, setSizePn, setSizeThickness } from '@/store/gaskets/putg'
import type { IPutgSize, PN } from '@/types/sizes'
import type { ISizeBlockPutg } from '@/types/putg'
import { Input } from '@/components/Input/input.style'

type Props = {
	sizes: IPutgSize[]
}

// размеры по стандарту
export const StandardSize: FC<Props> = ({ sizes }) => {
	const main = useAppSelector(state => state.putg.main)
	const material = useAppSelector(state => state.putg.material)
	const cardIndex = useAppSelector(state => state.putg.cardIndex)
	const size = useAppSelector(state => state.putg.size)
	const sizeErr = useAppSelector(state => state.putg.sizeError)

	const dispatch = useAppDispatch()

	const [curSize, setCurSize] = useState<IPutgSize | null>(null)

	useEffect(() => {
		if (cardIndex === undefined) {
			const s = sizes[0]

			const size: ISizeBlockPutg = {
				dn: s.dn,
				dnMm: s.dnMm || '',
				pn: s.sizes[0].pn[0],
				d4: s.sizes[0].d4,
				d3: s.sizes[0].d3,
				d2: s.sizes[0].d2,
				d1: s.sizes[0].d1,
				h: s.sizes[0].h[0],
				another: '',
			}

			dispatch(setSize(size))
			setCurSize(s)
		} else {
			const s = sizes.find(s => s.dn === size.dn)
			setCurSize(s || ({} as IPutgSize))
		}
	}, [sizes])

	const dnHandler = (event: SelectChangeEvent<string>) => {
		const s = sizes.find(s => s.dn === event.target.value)
		if (!s) return

		const size: ISizeBlockPutg = {
			dn: s.dn,
			dnMm: s.dnMm || '',
			pn: s.sizes[0].pn[0],
			d4: s.sizes[0].d4.replace(',', '.'),
			d3: s.sizes[0].d3.replace(',', '.'),
			d2: s.sizes[0].d2.replace(',', '.'),
			d1: s.sizes[0].d1.replace(',', '.'),
			h: s.sizes[0].h[0].replace(',', '.'),
			another: '',
		}

		dispatch(setSize(size))
		setCurSize(s)
	}

	const pnHandler = (event: SelectChangeEvent<string>) => {
		if (!curSize) return

		let sizeIdx = 0
		let pn: PN = {} as PN
		curSize.sizes.forEach((s, i) => {
			const candidate = s.pn.find(pn => pn.mpa === event.target.value)
			if (candidate) {
				pn = candidate
				sizeIdx = i
			}
		})

		const sizePn: any = {
			pn,
		}

		let newD4 = curSize.sizes[sizeIdx].d4.replace(',', '.')
		let newD3 = curSize.sizes[sizeIdx].d3.replace(',', '.')
		let newD2 = curSize.sizes[sizeIdx].d2.replace(',', '.')
		let newD1 = curSize.sizes[sizeIdx].d1.replace(',', '.')

		if (size.d4 != newD4 || size.d3 != newD3 || size.d2 != newD2 || size.d1 != newD1) {
			const s = {
				d4: newD4,
				d3: newD3,
				d2: newD2,
				d1: newD1,
			}
			sizePn.size = s
		}

		//TODO решить что делать с толщиной
		// if (size.h != curSize.sizes[sizeIdx].h[0]) {
		// 	const t = {
		// 		h: curSize.sizes[sizeIdx].h[0],
		// 	}
		// 	sizePn.thickness = t
		// }

		dispatch(setSizePn(sizePn))
	}

	// const thicknessHandler = (event: SelectChangeEvent<string>) => {
	// 	const s = curSize?.sizes.find(s => s.pn.some(pn => pn.mpa === size.pn.mpa))
	// 	if (!s) return

	// 	const newThickness: any = {
	// 		h: event.target.value,
	// 	}

	// 	if (event.target.value !== 'another') {
	// 		const idx = s.h.findIndex(h => h === event.target.value)
	// 		newThickness.h = s.h[idx]
	// 	}

	// 	dispatch(setSizeThickness(newThickness))
	// }

	const thicknessHandler = (event: ChangeEvent<HTMLInputElement>) => {
		const temp = event.target.value.replace(',', '.')

		if (event.target.value === '' || !isNaN(+temp)) {
			let value: number | string

			if (temp[temp.length - 1] == '.') value = temp
			else value = Math.trunc(+temp * 10) / 10

			if (event.target.value === '') value = event.target.value

			dispatch(setSizeThickness({ h: value.toString() }))
		}
	}

	return (
		<>
			<Typography fontWeight='bold'>{main.standard?.dnTitle}</Typography>
			<Select value={size.dn || 'not_selected'} onChange={dnHandler} size='small' sx={{ borderRadius: '12px' }}>
				<MenuItem disabled value='not_selected'>
					Выберите значение
				</MenuItem>
				{sizes.map(f => (
					<MenuItem key={f.id} value={f.dn}>
						{f.dn} {f.dnMm && `(${f.dnMm})`}
					</MenuItem>
				))}
			</Select>

			<Typography fontWeight='bold' mt={1}>
				{main.standard?.pnTitle}
			</Typography>
			<Select
				value={size.pn.mpa || 'not_selected'}
				onChange={pnHandler}
				size='small'
				sx={{ borderRadius: '12px' }}
			>
				<MenuItem disabled value='not_selected'>
					Выберите значение
				</MenuItem>
				{curSize?.sizes.map(s =>
					s.pn.map(pn => (
						<MenuItem key={pn.mpa} value={pn.mpa}>
							{pn.mpa} {pn.kg ? `(${pn.kg})` : ''}
						</MenuItem>
					))
				)}
			</Select>

			<Typography fontWeight='bold' mt={1}>
				Толщина прокладки по каркасу
			</Typography>
			{/* <Stack direction='row' spacing={1} alignItems='flex-start'> */}
			{/* <Select
				value={size.h || 'another'}
				onChange={thicknessHandler}
				size='small'
				sx={{ borderRadius: '12px', width: '100%' }}
			>
				{curSize?.sizes.map(s => {
					if (s.pn.some(pn => pn.mpa == size.pn.mpa)) {
						return s.h.map(h => (
							<MenuItem key={h} value={h}>
								{h}
							</MenuItem>
						))
					} else {
						return null
					}
				})}
			</Select> */}
			<Input
				name='thickness'
				value={size.h}
				onChange={thicknessHandler}
				error={sizeErr.thickness}
				helperText={
					sizeErr.thickness &&
					`толщина должна быть ≥ ${material.type?.minThickness.toFixed(
						1
					)} и ≤ ${material.type?.maxThickness.toFixed(1)}`
				}
				inputProps={{ inputMode: 'decimal' }}
				size='small'
			/>
		</>
	)
}

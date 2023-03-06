import { ChangeEvent, FC, useEffect, useState } from 'react'
import { MenuItem, Select, SelectChangeEvent, Stack, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { ISnpSize, PN } from '@/types/sizes'
import { setSize, setSizePn, setSizeThickness } from '@/store/gaskets/snp'
import { ISizeBlockSnp } from '@/types/snp'
import { Input } from '@/components/Input/input.style'

type Props = {
	sizes: ISnpSize[]
}

export const StandardSize: FC<Props> = ({ sizes }) => {
	const main = useAppSelector(state => state.snp.main)
	const size = useAppSelector(state => state.snp.size)

	const dispatch = useAppDispatch()

	const [curSize, setCurSize] = useState<ISnpSize | null>(null)

	useEffect(() => {
		const s = sizes[0]

		const size: ISizeBlockSnp = {
			dn: s.dn,
			pn: s.sizes[0].pn[0],
			d4: s.sizes[0].d4,
			d3: s.sizes[0].d3,
			d2: s.sizes[0].d2,
			d1: s.sizes[0].d1,
			h: s.sizes[0].h[0],
			s2: s.sizes[0].s2[0],
			s3: s.sizes[0].s3[0],
			another: '',
		}

		dispatch(setSize(size))
		setCurSize(s)
	}, [sizes])

	const dnHandler = (name: 'dn' | 'd2') => (event: SelectChangeEvent<string>) => {
		const s = sizes.find(s => s[name] === event.target.value)
		if (!s) return

		const size: ISizeBlockSnp = {
			dn: s.dn,
			pn: s.sizes[0].pn[0],
			d4: s.sizes[0].d4,
			d3: s.sizes[0].d3,
			d2: s.sizes[0].d2,
			d1: s.sizes[0].d1,
			h: s.sizes[0].h[0],
			s2: s.sizes[0].s2[0],
			s3: s.sizes[0].s3[0],
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

		if (
			size.d4 != curSize.sizes[sizeIdx].d4 ||
			size.d3 != curSize.sizes[sizeIdx].d3 ||
			size.d2 != curSize.sizes[sizeIdx].d2 ||
			size.d1 != curSize.sizes[sizeIdx].d1
		) {
			const s = {
				d4: curSize.sizes[sizeIdx].d4,
				d3: curSize.sizes[sizeIdx].d3,
				d2: curSize.sizes[sizeIdx].d2,
				d1: curSize.sizes[sizeIdx].d1,
			}
			sizePn.size = s
		}

		if (size.h != curSize.sizes[sizeIdx].h[0]) {
			const t = {
				h: curSize.sizes[sizeIdx].h[0],
				s2: curSize.sizes[sizeIdx].s2[0],
				s3: curSize.sizes[sizeIdx].s3[0],
			}
			sizePn.thickness = t
		}

		dispatch(setSizePn(sizePn))
	}

	const thicknessHandler = (event: SelectChangeEvent<string>) => {
		const s = curSize?.sizes.find(s => s.pn.some(pn => pn.mpa === size.pn.mpa))
		if (!s) return

		const newThickness: any = {
			h: event.target.value,
		}

		if (event.target.value !== 'another') {
			const idx = s.h.findIndex(h => h === event.target.value)
			newThickness.h = s.h[idx]
			newThickness.s2 = s.s2[idx]
			newThickness.s3 = s.s3[idx]
		}

		dispatch(setSizeThickness(newThickness))
	}

	const anotherThicknessHandler = (event: ChangeEvent<HTMLInputElement>) => {
		const regex = /^[0-9.,\b]+$/
		const temp = event.target.value.replaceAll(',', '.')

		if (isNaN(+temp)) return

		if (event.target.value === '' || regex.test(event.target.value)) {
			let value: number | string = Math.round(+temp * 10) / 10
			if (temp[temp.length - 1] == '.') value = temp
			if (event.target.value === '') value = event.target.value

			dispatch(setSizeThickness({ another: value.toString().replaceAll('.', ',') }))
		}
	}

	return (
		<>
			<Typography fontWeight='bold'>{main.snpStandard?.dnTitle}</Typography>
			<Select
				value={size.dn || 'not_selected'}
				onChange={dnHandler('dn')}
				size='small'
				sx={{ borderRadius: '12px' }}
			>
				<MenuItem disabled value='not_selected'>
					Выберите значение
				</MenuItem>
				{sizes.map(f => (
					<MenuItem key={f.id} value={f.dn}>
						{f.dn}
					</MenuItem>
				))}
			</Select>

			{main.snpStandard?.hasD2 && (
				<>
					<Typography fontWeight='bold'>D2</Typography>
					<Select
						value={size.d2 || 'not_selected'}
						onChange={dnHandler('d2')}
						size='small'
						sx={{ borderRadius: '12px' }}
					>
						<MenuItem disabled value='not_selected'>
							Выберите значение
						</MenuItem>
						{sizes.map(f => (
							<MenuItem key={f.id} value={f.d2}>
								{f.d2}
							</MenuItem>
						))}
					</Select>
				</>
			)}

			<Typography fontWeight='bold'>{main.snpStandard?.pnTitle}</Typography>
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

			<Typography fontWeight='bold'>Толщина каркаса прокладки</Typography>
			<Stack direction='row' spacing={1}>
				<Select
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
					<MenuItem value='another'>другая</MenuItem>
				</Select>

				{size.h == 'another' || size.h == '' ? (
					<Input value={size.another} onChange={anotherThicknessHandler} size='small' />
				) : null}
			</Stack>
		</>
	)
}

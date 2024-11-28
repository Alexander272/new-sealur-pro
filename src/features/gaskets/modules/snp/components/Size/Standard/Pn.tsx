import { FC } from 'react'
import { MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'

import type { PN } from '@/features/gaskets/types/sizes'
import type { ISizeBlock, ISnpSize } from '@/features/gaskets/modules/snp/types/size'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getPn, getSizeIndex, getStandard, getThickness, setSizePn } from '@/features/gaskets/modules/snp/snpSlice'

type Props = {
	sizes: ISnpSize[]
}

export const Pn: FC<Props> = ({ sizes }) => {
	const standard = useAppSelector(getStandard)
	const pn = useAppSelector(getPn)
	const h = useAppSelector(getThickness)
	const idx = useAppSelector(getSizeIndex)

	const dispatch = useAppDispatch()

	const pnHandler = (event: SelectChangeEvent<string>) => {
		if (!idx) return

		let sizeIdx = 0
		let pn: PN = {} as PN
		sizes[idx].sizes.forEach((s, i) => {
			const candidate = s.pn.find(pn => pn.mpa === event.target.value)
			if (candidate) {
				pn = candidate
				sizeIdx = i
			}
		})

		const sizePn: ISizeBlock = {
			pn,
			sizes: sizes[idx].sizes[sizeIdx],
		}

		// if (
		// 	size.d4 != curSize.sizes[sizeIdx].d4 ||
		// 	size.d3 != curSize.sizes[sizeIdx].d3 ||
		// 	size.d2 != curSize.sizes[sizeIdx].d2 ||
		// 	size.d1 != curSize.sizes[sizeIdx].d1
		// ) {
		// 	const s = {
		// 		d4: curSize.sizes[sizeIdx].d4,
		// 		d3: curSize.sizes[sizeIdx].d3,
		// 		d2: curSize.sizes[sizeIdx].d2,
		// 		d1: curSize.sizes[sizeIdx].d1,
		// 	}
		// 	sizePn.size = s
		// }

		if (h != sizes[idx].sizes[sizeIdx].h[0]) {
			const t = {
				h: sizes[idx].sizes[sizeIdx].h[0],
				s2: sizes[idx].sizes[sizeIdx].s2[0],
				s3: sizes[idx].sizes[sizeIdx].s3[0],
				another: '',
			}
			sizePn.thicknesses = t
		}

		dispatch(setSizePn(sizePn))
	}

	return (
		<>
			<Typography fontWeight='bold'>{standard?.pnTitle}</Typography>
			<Select value={pn.mpa || 'not_selected'} onChange={pnHandler}>
				<MenuItem disabled value='not_selected'>
					Выберите значение
				</MenuItem>

				{sizes[idx || 0]?.sizes.map(s =>
					s.pn.map(pn => (
						<MenuItem key={pn.mpa} value={pn.mpa}>
							{pn.mpa} {pn.kg ? `(${pn.kg})` : ''}
						</MenuItem>
					))
				)}
			</Select>
		</>
	)
}

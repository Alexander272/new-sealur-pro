import { FC } from 'react'
import { MenuItem, Select, SelectChangeEvent, Skeleton, Typography } from '@mui/material'

import type { IPutgSize, PN } from '@/features/gaskets/types/sizes'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getPn, getSizeIdx, getStandard, setSizePn } from '../../../putgSlice'

type Props = {
	sizes: IPutgSize[]
	isFetching?: boolean
}

export const Pn: FC<Props> = ({ sizes, isFetching }) => {
	const standard = useAppSelector(getStandard)
	const idx = useAppSelector(getSizeIdx)
	const pn = useAppSelector(getPn)

	const dispatch = useAppDispatch()

	const pnHandler = (event: SelectChangeEvent<string>) => {
		if (idx == undefined) return

		let sizeIdx = 0
		let pn: PN = {} as PN
		sizes[idx].sizes.forEach((s, i) => {
			const candidate = s.pn.find(pn => pn.mpa === event.target.value)
			if (candidate) {
				pn = candidate
				sizeIdx = i
			}
		})

		const sizePn = {
			pn,
			size: {
				d4: sizes[idx].sizes[sizeIdx].d4 || '',
				d3: sizes[idx].sizes[sizeIdx].d3,
				d2: sizes[idx].sizes[sizeIdx].d2,
				d1: sizes[idx].sizes[sizeIdx].d1 || '',
			},
		}
		dispatch(setSizePn(sizePn))
	}

	return (
		<>
			<Typography fontWeight='bold'>{standard?.pnTitle}</Typography>
			{isFetching ? (
				<Skeleton animation='wave' variant='rounded' height={40} sx={{ borderRadius: 3 }} />
			) : (
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
			)}
		</>
	)
}

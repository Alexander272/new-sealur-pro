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
		let pnIndex = -1
		let pn: PN = {} as PN
		sizes[idx].sizes.forEach((s, i) => {
			const idx = s.pn.findIndex(pn => pn.mpa === event.target.value)
			if (idx != -1) {
				pn = s.pn[idx]
				pnIndex = idx
				sizeIdx = i
			}
		})

		const sizePn = {
			pn,
			pnIndex: pnIndex,
			sizes: sizes[idx].sizes[sizeIdx],
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

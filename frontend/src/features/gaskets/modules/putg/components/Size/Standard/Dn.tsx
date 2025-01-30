import { FC } from 'react'
import { MenuItem, Select, SelectChangeEvent, Skeleton, Typography } from '@mui/material'

import type { IPutgSize } from '@/features/gaskets/types/sizes'
import type { ISizeBlockPutg } from '../../../types/putg'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getDn, getStandard, setSize } from '../../../putgSlice'

type Props = {
	sizes: IPutgSize[]
	isFetching: boolean
}

export const Dn: FC<Props> = ({ sizes, isFetching }) => {
	const standard = useAppSelector(getStandard)
	const dn = useAppSelector(getDn)

	const dispatch = useAppDispatch()

	const dnHandler = (event: SelectChangeEvent<string>) => {
		const idx = sizes.findIndex(s => s.dn === event.target.value)
		if (idx === -1) return

		const s = sizes[idx]
		const size: ISizeBlockPutg = {
			index: idx,
			dn: s.dn,
			dnMm: s.dnMm || '',
			pn: s.sizes[0].pn[0],
			d4: s.sizes[0].d4 || '',
			d3: s.sizes[0].d3,
			d2: s.sizes[0].d2,
			d1: s.sizes[0].d1 || '',
			h: s.sizes[0].h[0],
		}
		dispatch(setSize(size))
	}

	return (
		<>
			<Typography fontWeight='bold'>{standard?.dnTitle}</Typography>
			{isFetching ? (
				<Skeleton animation='wave' variant='rounded' height={40} sx={{ borderRadius: 3 }} />
			) : (
				<Select value={dn || 'not_selected'} onChange={dnHandler}>
					<MenuItem disabled value='not_selected'>
						Выберите значение
					</MenuItem>

					{sizes.map(f => (
						<MenuItem key={f.id} value={f.dn}>
							{f.dn} {f.dnMm && `(${f.dnMm})`}
						</MenuItem>
					))}
				</Select>
			)}
		</>
	)
}

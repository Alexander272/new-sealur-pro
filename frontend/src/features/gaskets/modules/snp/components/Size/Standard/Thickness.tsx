import { FC, useMemo } from 'react'
import { MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'

import type { ISnpSize } from '@/features/gaskets/modules/snp/types/size'
import type { IThickness } from '@/features/gaskets/modules/snp/types/snp'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getPn, getSizeIndex, getThickness, setSizeThickness } from '@/features/gaskets/modules/snp/snpSlice'

type Props = {
	sizes: ISnpSize[]
}

export const Thickness: FC<Props> = ({ sizes }) => {
	const pn = useAppSelector(getPn)
	const h = useAppSelector(getThickness)
	const idx = useAppSelector(getSizeIndex)

	const dispatch = useAppDispatch()

	const size = useMemo(() => sizes[idx || 0].sizes.find(s => s.pn.some(d => d.mpa == pn.mpa)), [idx, pn.mpa, sizes])

	const thicknessHandler = (event: SelectChangeEvent<string>) => {
		if (!size) return

		const newThickness: IThickness = {
			h: event.target.value,
			s2: '',
			s3: '',
		}

		if (event.target.value !== 'another') {
			const idx = size.h.findIndex(h => h === event.target.value)
			newThickness.h = size.h[idx]
			newThickness.s2 = size.s2[idx]
			newThickness.s3 = size.s3[idx]
		}

		dispatch(setSizeThickness(newThickness))
	}

	// TODO надо это все по тестировать
	return (
		<>
			<Typography fontWeight='bold'>Толщина прокладки по каркасу</Typography>
			<Select value={h || 'another'} onChange={thicknessHandler}>
				{size?.h.map(h => (
					<MenuItem key={h} value={h}>
						{h}
					</MenuItem>
				))}
				{/* {filteredSizes.map(s => {
					return s.h.map(h => (
						<MenuItem key={h} value={h}>
							{h}
						</MenuItem>
					))
				})} */}
			</Select>
		</>
	)
}

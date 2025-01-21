import { FC, useMemo } from 'react'
import { MenuItem, Select, SelectChangeEvent, Skeleton, Typography } from '@mui/material'

import type { ISnpSize } from '@/features/gaskets/modules/snp/types/size'
import type { ISizeBlockSnp } from '@/features/gaskets/modules/snp/types/snp'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getD2, getPn, setSize } from '@/features/gaskets/modules/snp/snpSlice'

type Props = {
	sizes: ISnpSize[]
	isFetching?: boolean
}

export const D2: FC<Props> = ({ sizes, isFetching }) => {
	const pn = useAppSelector(getPn)
	const d2 = useAppSelector(getD2)

	const dispatch = useAppDispatch()

	const filteredSizes = useMemo(
		() => sizes.filter(s => s.sizes.some(s => s.pn.some(d => d.mpa === pn.mpa))),
		[pn, sizes]
	)

	const d2Handler = (event: SelectChangeEvent<string>) => {
		//TODO правки внесены codeium, поэтому по тестировать
		const idx = filteredSizes.findIndex(s => s.d2 === event.target.value)
		// const idx = sizes.findIndex(s =>
		// 	s.sizes.some(s => s.d2 === event.target.value && s.pn.some(d => d.mpa === pn.mpa))
		// )
		if (idx === -1) return
		const s = filteredSizes[idx]
		// const s = sizes[idx]

		const ss = s.sizes.find(s => s.d2 === event.target.value && s.pn.some(d => d.mpa === pn.mpa))
		if (!ss) return

		const newSize: ISizeBlockSnp = {
			index: idx,
			dn: s.dn,
			dnMm: s.dnMm || '',
			pn: ss.pn[0],
			d4: ss.d4,
			d3: ss.d3,
			d2: ss.d2,
			d1: ss.d1,
			h: ss.h[0],
			s2: ss.s2[0],
			s3: ss.s3[0],
			another: '',
		}

		dispatch(setSize(newSize))
	}

	// const renderD2 = () => {
	// 	// const d2: ISNPMainSize[] = []
	// 	// sizes.forEach(s => {
	// 	// 	const curSize = s.sizes.find(s => s.pn.some(d => d.mpa == pn.mpa))
	// 	// 	if (curSize) d2.push(curSize)
	// 	// })

	// 	sizes.filter(s => s.sizes.some(s => s.pn.some(d => d.mpa === pn.mpa)))
	// 	return sizes.map(f => (
	// 		<MenuItem key={f.d2} value={f.d2}>
	// 			{f.d2}
	// 		</MenuItem>
	// 	))
	// }

	return (
		<>
			<Typography fontWeight='bold'>D2</Typography>
			{isFetching ? (
				<Skeleton animation='wave' variant='rounded' height={40} sx={{ borderRadius: 3 }} />
			) : (
				<Select value={d2 || 'not_selected'} onChange={d2Handler}>
					<MenuItem disabled value='not_selected'>
						Выберите значение
					</MenuItem>

					{filteredSizes.map(f => (
						<MenuItem key={f.d2} value={f.d2}>
							{f.d2}
						</MenuItem>
					))}
					{/* {renderD2()} */}
				</Select>
			)}
		</>
	)
}

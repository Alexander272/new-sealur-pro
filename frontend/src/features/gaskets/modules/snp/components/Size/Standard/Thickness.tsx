import { FC } from 'react'
import { MenuItem, Select, SelectChangeEvent, Skeleton, Typography } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getDn, getSizeId, getSnpTypeId, getThickness, setThickness } from '@/features/gaskets/modules/snp/snpSlice'
import { useGetSnpSizesQuery } from '../../../snpApiSlice'

type Props = unknown

export const Thickness: FC<Props> = () => {
	const snp = useAppSelector(getSnpTypeId)
	const dn = useAppSelector(getDn)
	const sizeId = useAppSelector(getSizeId)
	const h = useAppSelector(getThickness)

	const dispatch = useAppDispatch()

	const { data, isFetching } = useGetSnpSizesQuery({ typeId: snp, dn }, { skip: snp == 'not_selected' || !dn })
	const size = data?.data.find(s => s.id == sizeId)

	const thicknessHandler = (event: SelectChangeEvent<string>) => {
		const idx = size?.h.findIndex(h => h === event.target.value)
		if (idx != undefined && idx != -1) {
			dispatch(setThickness({ h: event.target.value, hIndex: idx, s2: size?.s2[idx], s3: size?.s3[idx] }))
		}
	}

	return (
		<>
			<Typography fontWeight='bold'>Толщина прокладки по каркасу</Typography>
			{isFetching ? (
				<Skeleton animation='wave' variant='rounded' height={40} sx={{ borderRadius: 3 }} />
			) : (
				<Select value={h || 'another'} onChange={thicknessHandler}>
					{size?.h.map(h => (
						<MenuItem key={h} value={h}>
							{h}
						</MenuItem>
					))}
				</Select>
			)}
		</>
	)
}

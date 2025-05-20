import { FC, useEffect } from 'react'
import { MenuItem, Select, SelectChangeEvent, Skeleton, Typography } from '@mui/material'

import type { ISizeData } from '@/features/gaskets/modules/snp/types/size'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getDn, getPn, getSnpTypeId, getStandard, setSize } from '@/features/gaskets/modules/snp/snpSlice'
import { useGetSnpSizesQuery } from '../../../snpApiSlice'

type Props = unknown

export const Pn: FC<Props> = () => {
	const standard = useAppSelector(getStandard)
	const snp = useAppSelector(getSnpTypeId)
	const dn = useAppSelector(getDn)
	const pn = useAppSelector(getPn)
	const dispatch = useAppDispatch()

	const { data, isFetching } = useGetSnpSizesQuery({ typeId: snp, dn }, { skip: snp == 'not_selected' || !dn })

	useEffect(() => {
		if (!data || data.data[0]?.dn != dn) return
		let idx = data.data.findIndex(s => s.pn === pn)
		if (idx == -1) idx = 0
		const newSize = {
			id: data.data[idx].id,
			dn: data.data[idx].dn,
			pn: data.data[idx].pn,
			pnAlt: data.data[idx].pnAlt,
			d4: data.data[idx].d4,
			d3: data.data[idx].d3,
			d2: data.data[idx].d2,
			d1: data.data[idx].d1,
			hIndex: 0,
			h: data.data[idx].h[0],
			s2: data.data[idx].s2[0],
			s3: data.data[idx].s3[0],
			another: '',
		}
		dispatch(setSize(newSize))
	}, [data, dispatch, pn, dn])

	const pnHandler = (event: SelectChangeEvent<string>) => {
		if (!data) return

		const size = data.data.find(s => s.pn === event.target.value)
		if (size) {
			const newSize: ISizeData = {
				id: size.id,
				dn: size.dn,
				pn: size.pn,
				pnAlt: size.pnAlt,
				d4: size.d4,
				d3: size.d3,
				d2: size.d2,
				d1: size.d1,
				hIndex: 0,
				h: size.h[0],
				s2: size.s2[0],
				s3: size.s3[0],
				another: '',
			}
			dispatch(setSize(newSize))
		}
	}

	return (
		<>
			<Typography fontWeight='bold'>{standard?.pnTitle}</Typography>
			{isFetching ? (
				<Skeleton animation='wave' variant='rounded' height={40} sx={{ borderRadius: 3 }} />
			) : (
				<Select value={pn || 'not_selected'} onChange={pnHandler}>
					<MenuItem disabled value='not_selected'>
						Выберите значение
					</MenuItem>

					{data?.data.map(d => (
						<MenuItem key={d.id} value={d.pn}>
							{d.pn} {d.pnAlt ? `(${d.pnAlt})` : ''}
						</MenuItem>
					))}
				</Select>
			)}
		</>
	)
}

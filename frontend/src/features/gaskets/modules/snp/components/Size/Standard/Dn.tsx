import { FC, useEffect } from 'react'
import { MenuItem, Select, SelectChangeEvent, Skeleton, Typography } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getActive } from '@/features/card/cardSlice'
import { getDn, getSnpTypeId, getStandard, setDn } from '@/features/gaskets/modules/snp/snpSlice'
import { useGetSnpDnQuery } from '../../../snpApiSlice'

type Props = unknown

export const Dn: FC<Props> = () => {
	const active = useAppSelector(getActive)
	const snp = useAppSelector(getSnpTypeId)
	const standard = useAppSelector(getStandard)
	const dn = useAppSelector(getDn)
	const dispatch = useAppDispatch()

	const { data, isFetching } = useGetSnpDnQuery(
		{ typeId: snp, hasD2: standard?.hasD2 },
		{ skip: snp == 'not_selected' }
	)

	useEffect(() => {
		if (!data || active) return
		dispatch(setDn({ dn: data.data[0].dn }))
	}, [data, active, dispatch])

	const dnHandler = (event: SelectChangeEvent<string>) => {
		dispatch(setDn({ dn: event.target.value }))
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

					{data?.data.map(f => (
						<MenuItem key={f.dn} value={f.dn}>
							{f.dn} {f.dn != f.alt.toString() && `(${f.alt})`}
						</MenuItem>
					))}
				</Select>
			)}
		</>
	)
}

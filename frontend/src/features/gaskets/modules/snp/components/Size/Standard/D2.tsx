import { FC } from 'react'
import { MenuItem, Select, SelectChangeEvent, Skeleton, Typography } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getD2, getSnpTypeId, getStandard, setDn } from '@/features/gaskets/modules/snp/snpSlice'
import { useGetSnpDnQuery } from '../../../snpApiSlice'

type Props = unknown

export const D2: FC<Props> = () => {
	const snp = useAppSelector(getSnpTypeId)
	const standard = useAppSelector(getStandard)
	const d2 = useAppSelector(getD2)

	const dispatch = useAppDispatch()

	const { data, isFetching } = useGetSnpDnQuery(
		{ typeId: snp, hasD2: standard?.hasD2 },
		{ skip: snp == 'not_selected' }
	)

	const d2Handler = (event: SelectChangeEvent<string>) => {
		const dn = data?.data.find(d => d.d2 === event.target.value)?.dn
		if (dn) dispatch(setDn({ dn: dn, d2: event.target.value }))
	}

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

					{data?.data.map(f => (
						<MenuItem key={f.dn} value={f.d2}>
							{f.d2}
						</MenuItem>
					))}
				</Select>
			)}
		</>
	)
}

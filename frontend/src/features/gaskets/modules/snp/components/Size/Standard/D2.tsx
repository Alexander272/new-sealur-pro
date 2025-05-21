import { FC } from 'react'
import { MenuItem, Select, SelectChangeEvent, Skeleton, Typography } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getD2, getDn, getPn, getSnpTypeId, getStandard, setDn, setSize } from '@/features/gaskets/modules/snp/snpSlice'
import { useGetSnpDnQuery, useGetSnpSizesQuery } from '../../../snpApiSlice'

type Props = unknown

export const D2: FC<Props> = () => {
	const snp = useAppSelector(getSnpTypeId)
	const standard = useAppSelector(getStandard)
	const d2 = useAppSelector(getD2)
	const dn = useAppSelector(getDn)
	const pn = useAppSelector(getPn)

	const dispatch = useAppDispatch()

	// ОСТ 26.260.454-99  ГОСТ 28759.3 (сосуды и аппараты)
	// список dn/d2 неправильный появляются дубли dn, т.к d2 для разных pn могут отличаться
	// может написать тут еще один запрос на получение всех d2 и изменять dn/pn при выборе
	// сейчас оно работает странно тк если размеры запрашиваются, то нужно 2 раза выбрать d2

	const { data: sizes } = useGetSnpSizesQuery({ typeId: snp, dn }, { skip: snp == 'not_selected' || !dn })
	const { data, isFetching } = useGetSnpDnQuery(
		{ typeId: snp, hasD2: standard?.hasD2 },
		{ skip: snp == 'not_selected' }
	)

	const d2Handler = (event: SelectChangeEvent<string>) => {
		const dn = data?.data.find(d => d.d2 === event.target.value)?.dn
		if (dn) dispatch(setDn({ dn: dn, d2: event.target.value }))
		const size = sizes?.data.find(s => s.d2 === event.target.value)
		if (!size || size.pn == pn) return
		const newSize = {
			...size,
			hIndex: 0,
			h: size.h[0],
			s2: size.s2[0],
			s3: size.s3[0],
			another: '',
		}
		dispatch(setSize(newSize))
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
						<MenuItem key={f.d2} value={f.d2}>
							{f.d2}
						</MenuItem>
					))}
				</Select>
			)}
		</>
	)
}

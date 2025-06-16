import { useEffect } from 'react'
import { MenuItem, Select, SelectChangeEvent, Skeleton, Typography } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getActive } from '@/features/card/cardSlice'
import { useGetJacketedDnQuery } from '../../../jacketedApiSlice'
import { getDn, getFlangeType, getStandard, setDn } from '../../../jacketedSlice'

export const Dn = () => {
	const active = useAppSelector(getActive)
	const standard = useAppSelector(getStandard)
	const flange = useAppSelector(getFlangeType)
	const dn = useAppSelector(getDn)
	const dispatch = useAppDispatch()

	const { data, isFetching } = useGetJacketedDnQuery(flange?.id || '', { skip: !flange?.id })

	useEffect(() => {
		if (!data || active) return
		dispatch(setDn(data.data[0]?.alt))
	}, [data, active, dispatch])

	const dnHandler = (event: SelectChangeEvent) => {
		const newDn = +event.target.value
		dispatch(setDn(newDn))
	}

	return (
		<>
			<Typography fontWeight='bold'>{standard?.dnTitle}</Typography>

			{isFetching ? (
				<Skeleton animation='wave' variant='rounded' height={40} sx={{ borderRadius: 3 }} />
			) : (
				<Select value={dn?.toString() || 'not_selected'} onChange={dnHandler}>
					<MenuItem disabled value='not_selected'>
						Выберите значение
					</MenuItem>

					{data?.data.map(f => (
						<MenuItem key={f.dn} value={f.alt}>
							{f.dn} {f.dn != f.alt.toString() && `(${f.alt})`}
						</MenuItem>
					))}
				</Select>
			)}
		</>
	)
}

import { useEffect } from 'react'
import { MenuItem, Select, SelectChangeEvent, Skeleton, Typography } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getActive } from '@/features/card/cardSlice'
import { useGetSerratedDnQuery } from '../../../serratedApiSlice'
import { getDn, getFlangeType, getStandard, setDn } from '../../../serratedSlice'

export const Dn = () => {
	const active = useAppSelector(getActive)
	const standard = useAppSelector(getStandard)
	const flange = useAppSelector(getFlangeType)
	const dn = useAppSelector(getDn)
	const dispatch = useAppDispatch()

	const { data, isFetching } = useGetSerratedDnQuery(flange?.id || '', { skip: !flange?.id })

	useEffect(() => {
		if (!data || active) return
		if (!dn) dispatch(setDn(data.data[0]?.alt))
	}, [data, dn, active, dispatch])

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

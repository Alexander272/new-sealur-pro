import { useEffect } from 'react'
import { MenuItem, Select, SelectChangeEvent, Skeleton, Typography } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { useGetJacketedSizesQuery } from '../../../jacketedApiSlice'
import { getDn, getFlangeType, getPn, getStandard, setSize } from '../../../jacketedSlice'

export const Pn = () => {
	const standard = useAppSelector(getStandard)
	const flange = useAppSelector(getFlangeType)
	const dn = useAppSelector(getDn)
	const pn = useAppSelector(getPn)
	const dispatch = useAppDispatch()

	const { data, isFetching } = useGetJacketedSizesQuery(
		{ flange: flange?.id || '', dn: dn?.toString() },
		{ skip: !flange?.id || !dn }
	)

	useEffect(() => {
		if (!data || data.data[0]?.dnAlt != dn) return
		const idx = data.data.findIndex(s => s.pn === pn)
		if (idx != -1) dispatch(setSize(data.data[idx]))
		else dispatch(setSize(data.data[0]))
	}, [data, dispatch, pn, dn])

	const pnHandler = (event: SelectChangeEvent) => {
		if (!data) return

		const size = data.data.find(s => s.pn === event.target.value)
		if (size) dispatch(setSize(size))
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

					{data?.data.map(s => (
						<MenuItem key={s.id} value={s.pn}>
							{s.pn} {s.pnAlt ? `(${s.pnAlt})` : ''}
						</MenuItem>
					))}
				</Select>
			)}
		</>
	)
}

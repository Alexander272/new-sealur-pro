import { useEffect } from 'react'
import { MenuItem, Select, SelectChangeEvent, Skeleton, Typography } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getActive } from '@/features/card/cardSlice'
import { useGetWavePlatingQuery } from '../../waveApiSlice'
import { getPlating, getStandard, setPlating } from '../../waveSlice'

export const Plating = () => {
	const active = useAppSelector(getActive)
	const standard = useAppSelector(getStandard)
	const plating = useAppSelector(getPlating)
	const dispatch = useAppDispatch()

	const { data, isFetching, isUninitialized } = useGetWavePlatingQuery(standard?.id || '', { skip: !standard })

	useEffect(() => {
		if (data && !active?.id && !isFetching) dispatch(setPlating(data.data[0]))
	}, [data, active, isFetching, dispatch])

	useEffect(() => {
		if (!data || !active || isFetching) return
		let idx = data.data.findIndex(c => c.id === plating?.id)
		if (idx == -1) idx = 0
		dispatch(setPlating(data.data[idx]))
	}, [data, plating, active, isFetching, dispatch])

	useEffect(() => {
		if (!plating && data) dispatch(setPlating(data.data[0]))
	}, [data, plating, dispatch])

	const platingHandler = (event: SelectChangeEvent<string>) => {
		const plating = data?.data.find(m => m.id === event.target.value)
		if (plating) dispatch(setPlating(plating))
	}

	return (
		<>
			<Typography fontWeight='bold' mt={1}>
				Материал плакировки
			</Typography>

			{isFetching || isUninitialized ? (
				<Skeleton animation='wave' variant='rounded' height={40} sx={{ borderRadius: 3 }} />
			) : (
				<Select value={plating?.id || 'not_selected'} onChange={platingHandler} disabled={isFetching} fullWidth>
					<MenuItem value='not_selected'>Выберите материал</MenuItem>

					{data?.data.map(m => (
						<MenuItem key={m.id} value={m.id}>
							{m.title} ({m.description}
							{m.description && ', '}
							{m.temperature})
						</MenuItem>
					))}
				</Select>
			)}
		</>
	)
}

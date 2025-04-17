import { useEffect } from 'react'
import { MenuItem, Select, SelectChangeEvent, Skeleton, Typography } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getDn, getPnMpa, getStandard, getType, setSize } from '../../../waveSlice'
import { useGetWaveSizesQuery } from '../../../waveApiSlice'

export const Pn = () => {
	const standard = useAppSelector(getStandard)
	const type = useAppSelector(getType)
	const dn = useAppSelector(getDn)
	const pnMpa = useAppSelector(getPnMpa)
	const dispatch = useAppDispatch()

	const { data, isFetching } = useGetWaveSizesQuery({ type: type?.id || '', dn: dn }, { skip: !type?.id || !dn })

	// useEffect(() => {
	// 	if (!data || !active) return
	// }, [data, active, dispatch, pnMpa])
	useEffect(() => {
		if (!data || data.data[0].dn != dn) return
		const idx = data.data.findIndex(s => s.pnMpa === pnMpa)
		if (idx != -1) dispatch(setSize(data.data[idx]))
		else dispatch(setSize(data.data[0]))
	}, [data, dispatch, pnMpa, dn])

	const pnHandler = (event: SelectChangeEvent) => {
		if (!data) return

		const size = data.data.find(s => s.pnMpa === event.target.value)
		if (size) dispatch(setSize(size))
	}

	return (
		<>
			<Typography fontWeight='bold'>{standard?.pnTitle}</Typography>
			{isFetching ? (
				<Skeleton animation='wave' variant='rounded' height={40} sx={{ borderRadius: 3 }} />
			) : (
				<Select value={pnMpa || 'not_selected'} onChange={pnHandler}>
					<MenuItem disabled value='not_selected'>
						Выберите значение
					</MenuItem>

					{data?.data.map(s => (
						<MenuItem key={s.id} value={s.pnMpa}>
							{s.pnMpa} {s.pnKg ? `(${s.pnKg})` : ''}
						</MenuItem>
					))}
				</Select>
			)}
		</>
	)
}

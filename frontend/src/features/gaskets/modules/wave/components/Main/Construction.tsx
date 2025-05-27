import { useEffect } from 'react'
import { MenuItem, Select, SelectChangeEvent, Skeleton, Typography } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getActive } from '@/features/card/cardSlice'
import { useGetWaveConstructionsQuery } from '../../waveApiSlice'
import { getConfiguration, getConstruction, getStandard, getType, setConstruction } from '../../waveSlice'

export const Construction = () => {
	const active = useAppSelector(getActive)
	const standard = useAppSelector(getStandard)
	const configuration = useAppSelector(getConfiguration)
	const construction = useAppSelector(getConstruction)
	const type = useAppSelector(getType)
	const dispatch = useAppDispatch()

	const { data, isFetching, isUninitialized } = useGetWaveConstructionsQuery(
		{ type: type?.baseId || '', standard: standard?.id || '' },
		{
			skip: !type?.baseId || !standard?.id,
		}
	)

	useEffect(() => {
		if (!data || active?.id || isFetching) return
		if (construction) {
			let idx = data.data.findIndex(c => c.code === construction?.code)
			if (idx == -1) idx = 0
			dispatch(setConstruction(data.data[idx]))
		} else dispatch(setConstruction(data.data[0]))
	}, [data, active, isFetching, dispatch, construction])

	useEffect(() => {
		if (!data || !active || isFetching || !type?.id) return
		let idx = construction ? data.data.findIndex(c => c.id === construction?.id) : 0
		if (idx == -1) idx = 0
		dispatch(setConstruction(data.data[idx]))
	}, [data, construction, active, isFetching, dispatch, type])

	useEffect(() => {
		if (!data || !configuration || active || isFetching) return
		dispatch(setConstruction(data.data[0]))
	}, [data, configuration, active, isFetching, dispatch])

	const constructionHandler = (event: SelectChangeEvent<string>) => {
		const construction = data?.data.find(s => s.code === event.target.value)
		if (!construction) return
		dispatch(setConstruction(construction))
	}

	return (
		<>
			<Typography fontWeight='bold' mt={1}>
				Тип конструкции
			</Typography>

			{isFetching || isUninitialized ? (
				<Skeleton animation='wave' variant='rounded' height={40} sx={{ borderRadius: 3 }} />
			) : (
				<Select
					value={construction?.code || 'not_selected'}
					onChange={constructionHandler}
					name='construction'
					disabled={isFetching || isUninitialized}
				>
					<MenuItem disabled value='not_selected'>
						Выберите тип конструкции
					</MenuItem>

					{data?.data.map(f => (
						<MenuItem key={f.id} value={f.code}>
							{f.code} - {f.title}
						</MenuItem>
					))}
				</Select>
			)}
		</>
	)
}

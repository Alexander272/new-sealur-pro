import { useEffect } from 'react'
import { MenuItem, Select, SelectChangeEvent, Skeleton, Typography } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getActive } from '@/features/card/cardSlice'
import { useGetPutgFlangeTypesQuery } from '../../putgApiSlice'
import { getFlangeType, getStandard, setMainFlangeType } from '../../putgSlice'

export const Flange = () => {
	const active = useAppSelector(getActive)
	const standard = useAppSelector(getStandard)
	const flange = useAppSelector(getFlangeType)
	const dispatch = useAppDispatch()

	const { data, isFetching, isUninitialized } = useGetPutgFlangeTypesQuery(standard?.id || '', { skip: !standard })

	useEffect(() => {
		if (data && !active?.id) dispatch(setMainFlangeType(data.data[0]))
	}, [data, active, dispatch])

	const flangeTypeHandler = (event: SelectChangeEvent<string>) => {
		const flangeType = data?.data.find(f => f.id === event.target.value)
		if (!flangeType) return
		dispatch(setMainFlangeType(flangeType))
	}

	return (
		<>
			<Typography fontWeight='bold' mt={1}>
				Тип фланца
			</Typography>
			{isFetching || isUninitialized ? (
				<Skeleton animation='wave' variant='rounded' height={40} sx={{ borderRadius: 3 }} />
			) : (
				<Select
					value={flange?.id || 'not_selected'}
					onChange={flangeTypeHandler}
					disabled={Boolean(active?.id) || isFetching}
				>
					<MenuItem disabled value='not_selected'>
						Выберите тип фланца
					</MenuItem>

					{(data?.data || []).map(f => (
						<MenuItem key={f.id} value={f.id}>
							{f.title}
						</MenuItem>
					))}
				</Select>
			)}
		</>
	)
}

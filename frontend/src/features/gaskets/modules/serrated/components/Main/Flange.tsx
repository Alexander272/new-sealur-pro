import { useCallback } from 'react'
// import { MenuItem, Select, SelectChangeEvent, Skeleton, Typography } from '@mui/material'

import type { IFlangeType } from '../../types/main'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
// import { getActive } from '@/features/card/cardSlice'
import { BaseFlangeType } from '@/features/gaskets/components/main/FlangeType/Flange'
import { useGetSerratedFlangeTypesQuery } from '../../serratedApiSlice'
import { getFlangeType, getStandard, setMainFlangeType } from '../../serratedSlice'

export const FlangeType = () => {
	// const active = useAppSelector(getActive)
	const standard = useAppSelector(getStandard)
	const flange = useAppSelector(getFlangeType)
	const dispatch = useAppDispatch()

	const { data, isFetching } = useGetSerratedFlangeTypesQuery(standard?.id || '', { skip: !standard })

	// useEffect(() => {
	// 	if (data && !active?.id && !isFetching) dispatch(setMainFlangeType(data.data[0]))
	// }, [data, active, isFetching, dispatch])s
	// useEffect(() => {
	// 	if (!data || !active || isFetching) return
	// 	let idx = data.data.findIndex(c => c.id === flange?.id)
	// 	if (idx == -1) idx = 0
	// 	dispatch(setMainFlangeType(data.data[idx]))
	// }, [data, flange, isFetching, active, dispatch])

	// const flangeTypeHandler = (event: SelectChangeEvent<string>) => {
	// 	const flangeType = data?.data.find(f => f.id === event.target.value)
	// 	if (!flangeType) return
	// 	dispatch(setMainFlangeType(flangeType))
	// }

	const changeHandler = useCallback((value: IFlangeType) => dispatch(setMainFlangeType(value)), [dispatch])

	return (
		<BaseFlangeType data={data?.data || []} isFetching={isFetching} value={flange?.id} onChange={changeHandler} />
	)
	// return (
	// 	<>
	// 		<Typography fontWeight='bold' mt={1}>
	// 			Тип фланца
	// 		</Typography>
	// 		{isFetching || isUninitialized ? (
	// 			<Skeleton animation='wave' variant='rounded' height={40} sx={{ borderRadius: 3 }} />
	// 		) : (
	// 			<Select
	// 				value={flange?.id || 'not_selected'}
	// 				onChange={flangeTypeHandler}
	// 				disabled={Boolean(active?.id) || isFetching}
	// 			>
	// 				<MenuItem disabled value='not_selected'>
	// 					Выберите тип фланца
	// 				</MenuItem>

	// 				{(data?.data || []).map(f => (
	// 					<MenuItem key={f.id} value={f.id}>
	// 						{f.title}
	// 					</MenuItem>
	// 				))}
	// 			</Select>
	// 		)}
	// 	</>
	// )
}

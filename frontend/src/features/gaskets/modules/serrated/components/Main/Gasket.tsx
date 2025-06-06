import { useCallback } from 'react'
// import { MenuItem, Select, SelectChangeEvent, Skeleton, Typography } from '@mui/material'

import type { ISerratedType } from '../../types/main'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
// import { getActive } from '@/features/card/cardSlice'
import { BaseGasket } from '@/features/gaskets/components/main/Gasket/Gasket'
import { useGetSerratedTypesQuery } from '../../serratedApiSlice'
import { getFlangeType, getType, setType } from '../../serratedSlice'

export const Gasket = () => {
	// const active = useAppSelector(getActive)
	const flange = useAppSelector(getFlangeType)
	const type = useAppSelector(getType)
	const dispatch = useAppDispatch()

	const { data, isFetching, isUninitialized } = useGetSerratedTypesQuery(flange?.id || '', {
		skip: !flange?.id,
	})

	// useEffect(() => {
	// 	if (data && !active?.id && !isFetching) dispatch(setType(data.data[0]))
	// }, [data, active, isFetching, dispatch])

	// useEffect(() => {
	// 	if (!data || !active || isFetching) return
	// 	let idx = data.data.findIndex(c => c.id === type?.id)
	// 	if (idx == -1) idx = 0
	// 	dispatch(setType(data.data[idx]))
	// }, [data, type, active, isFetching, dispatch])

	// const typeHandler = (event: SelectChangeEvent<string>) => {
	// 	const type = data?.data.find(s => s.id === event.target.value)
	// 	if (!type) return
	// 	dispatch(setType(type))
	// }

	const changeHandler = useCallback((value: ISerratedType) => dispatch(setType(value)), [dispatch])

	return (
		<BaseGasket
			data={data?.data || []}
			isFetching={isFetching || isUninitialized}
			value={type?.id}
			onChange={changeHandler}
		/>
	)
	// return (
	// 	<>
	// 		<Typography fontWeight='bold' mt={1}>
	// 			Тип прокладки
	// 		</Typography>
	// 		{isFetching || isUninitialized ? (
	// 			<Skeleton animation='wave' variant='rounded' height={41} sx={{ borderRadius: 3 }} />
	// 		) : (
	// 			<Select
	// 				value={type?.id || 'not_selected'}
	// 				onChange={typeHandler}
	// 				disabled={isFetching || isUninitialized}
	// 			>
	// 				<MenuItem disabled value='not_selected'>
	// 					Выберите тип прокладки
	// 				</MenuItem>

	// 				{data?.data.map(f => (
	// 					<MenuItem key={f.id} value={f.id}>
	// 						{f.code} - {f.title}
	// 					</MenuItem>
	// 				))}
	// 			</Select>
	// 		)}
	// 	</>
	// )
}

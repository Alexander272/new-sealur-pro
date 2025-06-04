import { useCallback } from 'react'
// import { MenuItem, Select, SelectChangeEvent, Skeleton, Typography } from '@mui/material'

import type { IWaveType } from '../../types/main'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
// import { getActive } from '@/features/card/cardSlice'
import { BaseGasket } from '@/features/gaskets/components/main/Gasket/Gasket'
import { useGetWaveTypesQuery } from '../../waveApiSlice'
import { getConfiguration, getFlangeType, getType, setType } from '../../waveSlice'

export const Gasket = () => {
	// const active = useAppSelector(getActive)
	const configuration = useAppSelector(getConfiguration)
	const flange = useAppSelector(getFlangeType)
	const type = useAppSelector(getType)
	const dispatch = useAppDispatch()

	const { data, isFetching } = useGetWaveTypesQuery(flange?.id || '', {
		skip: !flange?.id,
	})

	// useEffect(() => {
	// 	if (data && !active?.id && !isFetching) dispatch(setType(data.data[0]))
	// }, [data, active, isFetching, configuration, dispatch])

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

	const changeHandler = useCallback((value: IWaveType) => dispatch(setType(value)), [dispatch])

	return (
		<BaseGasket
			data={data?.data || []}
			isFetching={isFetching}
			value={type?.id}
			onChange={changeHandler}
			configuration={configuration?.code}
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
	// 				name='gasket'
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

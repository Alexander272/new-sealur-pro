import { useCallback } from 'react'
// import { MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'

import type { IPutgType } from '../../types/materials'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
// import { getActive } from '@/features/card/cardSlice'
import { BaseGasket } from '@/features/gaskets/components/main/Gasket/Gasket'
import { getConfiguration, getFiller, getType, setType } from '../../putgSlice'
import { useGetPutgTypesQuery } from '../../putgApiSlice'

export const Gasket = () => {
	// const active = useAppSelector(getActive)
	const configuration = useAppSelector(getConfiguration)
	const type = useAppSelector(getType)
	const filler = useAppSelector(getFiller)
	const dispatch = useAppDispatch()

	const { data, isFetching, isUninitialized } = useGetPutgTypesQuery(filler?.baseId || '', { skip: !filler?.baseId })

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
	// 	const type = data?.data.find(s => s.code === event.target.value)
	// 	if (!type) return
	// 	dispatch(setType(type))
	// }

	const changeHandler = useCallback((value: IPutgType) => dispatch(setType(value)), [dispatch])

	return (
		<BaseGasket
			data={data?.data || []}
			isFetching={isFetching || isUninitialized}
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
	// 		<Select value={type?.code || 'not_selected'} onChange={typeHandler} disabled={isFetching}>
	// 			<MenuItem disabled value='not_selected'>
	// 				Выберите тип прокладки
	// 			</MenuItem>

	// 			{data?.data.map(f => (
	// 				<MenuItem key={f.id} value={f.code}>
	// 					{f.code} - {f.title}
	// 				</MenuItem>
	// 			))}
	// 		</Select>
	// 	</>
	// )
}

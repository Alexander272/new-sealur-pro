import { useCallback } from 'react'
// import { MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'

import type { IFiller } from '../../types/materials'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
// import { getActive } from '@/features/card/cardSlice'
import { BaseFiller } from '@/features/gaskets/components/materials/Filler'
import { getFiller, getStandard, setMaterialFiller } from '../../putgSlice'
import { useGetPutgFillersQuery } from '../../putgApiSlice'

export const Filler = () => {
	// const active = useAppSelector(getActive)
	const filler = useAppSelector(getFiller)
	const standard = useAppSelector(getStandard)
	const dispatch = useAppDispatch()

	const { data, isFetching } = useGetPutgFillersQuery(standard?.id || '', { skip: !standard?.id })

	// useEffect(() => {
	// 	if (data && !active?.id && !isFetching) dispatch(setMaterialFiller(data.data[0]))
	// }, [data, active, isFetching, dispatch])
	// useEffect(() => {
	// 	if (!data || !active || isFetching) return
	// 	let idx = data.data.findIndex(c => c.id === filler?.id)
	// 	if (idx == -1) idx = 0
	// 	dispatch(setMaterialFiller(data.data[idx]))
	// }, [data, filler, active, isFetching, dispatch])

	// const fillerHandler = (event: SelectChangeEvent<string>) => {
	// 	const filler = data?.data.find(s => s.id === event.target.value)
	// 	if (!filler) return
	// 	dispatch(setMaterialFiller(filler))
	// }

	const changeHandler = useCallback((value: IFiller) => dispatch(setMaterialFiller(value)), [dispatch])

	return <BaseFiller data={data?.data || []} isFetching={isFetching} value={filler?.id} onChange={changeHandler} />
	// return (
	// 	<>
	// 		<Typography fontWeight='bold'>Материал прокладки</Typography>
	// 		<Select
	// 			value={filler?.id || 'not_selected'}
	// 			onChange={fillerHandler}
	// 			disabled={Boolean(active?.id) || isFetching}
	// 			size='small'
	// 			sx={{
	// 				borderRadius: '12px',
	// 				width: '100%',
	// 			}}
	// 		>
	// 			<MenuItem disabled value='not_selected'>
	// 				Выберите материал прокладки
	// 			</MenuItem>

	// 			{data?.data.map(f => (
	// 				<MenuItem key={f.id} value={f.id}>
	// 					{f.title} ({f.description}
	// 					{f.description && ', '}
	// 					{f.temperature})
	// 				</MenuItem>
	// 			))}
	// 		</Select>
	// 	</>
	// )
}

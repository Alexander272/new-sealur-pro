import { useCallback, useEffect } from 'react'
// import { MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'

import type { IConstruction } from '../../types/materials'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getActive } from '@/features/card/cardSlice'
import { BaseConstruction } from '@/features/gaskets/components/main/Construction/Construction'
import { getConstruction, getFiller, getFlangeType, setConstruction } from '../../putgSlice'
import { useGetPutgConstructionsQuery } from '../../putgApiSlice'

export const Construction = () => {
	const active = useAppSelector(getActive)
	// const configuration = useAppSelector(getConfiguration)
	const construction = useAppSelector(getConstruction)
	const filler = useAppSelector(getFiller)
	const flangeType = useAppSelector(getFlangeType)
	const dispatch = useAppDispatch()

	const { data, isFetching, isUninitialized } = useGetPutgConstructionsQuery(
		{ filler: filler?.baseId || '', flangeType: flangeType?.id || '' },
		{ skip: !filler?.baseId || !flangeType?.id }
	)

	useEffect(() => {
		if (data && !active?.id && !isFetching) dispatch(setConstruction(data.data[0]))
	}, [data, active, isFetching, dispatch])

	// useEffect(() => {
	// 	if (!data || active?.id || isFetching) return
	// 	if (construction) {
	// 		let idx = data.data.findIndex(c => c.code === construction?.code)
	// 		if (idx == -1) idx = 0
	// 		dispatch(setConstruction(data.data[idx]))
	// 	} else dispatch(setConstruction(data.data[0]))
	// }, [data, active, isFetching, dispatch, construction])

	// useEffect(() => {
	// 	if (!data || !active || isFetching || !filler?.baseId || !flangeType?.id) return
	// 	let idx = construction ? data.data.findIndex(c => c.id === construction?.id) : 0
	// 	if (idx == -1) idx = 0
	// 	dispatch(setConstruction(data.data[idx]))
	// }, [data, construction, active, isFetching, dispatch, filler, flangeType])

	// const constructionHandler = (event: SelectChangeEvent<string>) => {
	// 	const construction = data?.data.find(s => s.code === event.target.value)
	// 	if (!construction) return
	// 	dispatch(setConstruction(construction))
	// }

	const changeHandler = useCallback((value: IConstruction) => dispatch(setConstruction(value)), [dispatch])

	return (
		<BaseConstruction
			data={data?.data || []}
			isFetching={isFetching || isUninitialized}
			value={construction}
			type={flangeType?.id}
			onChange={changeHandler}
		/>
	)
	// return (
	// 	<>
	// 		<Typography fontWeight='bold' mt={1}>
	// 			Тип конструкции
	// 		</Typography>
	// 		<Select value={construction?.code || 'not_selected'} onChange={constructionHandler} disabled={isFetching}>
	// 			<MenuItem disabled value='not_selected'>
	// 				Выберите тип конструкции
	// 			</MenuItem>

	// 			{data?.data.map(f => {
	// 				// TODO сделать бы это как-то нормально, не переписывая кучу вещей
	// 				if (configuration?.code != 'round' && f.baseId == '3b4c6497-7b53-42ba-9800-c1055ca90412') return
	// 				return (
	// 					<MenuItem key={f.id} value={f.code}>
	// 						{f.code} - {f.title}
	// 					</MenuItem>
	// 				)
	// 			})}
	// 		</Select>
	// 	</>
	// )
}

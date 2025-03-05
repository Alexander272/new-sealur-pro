import { useEffect } from 'react'
import { MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getActive } from '@/features/card/cardSlice'
import { getConstruction, getFiller, getFlangeType, setConstruction } from '../../putgSlice'
import { useGetPutgConstructionsQuery } from '../../putgApiSlice'

export const Construction = () => {
	const active = useAppSelector(getActive)
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
	useEffect(() => {
		if (!data || !active || isFetching) return
		let idx = data.data.findIndex(c => c.id === construction?.id)
		if (idx == -1) idx = 0
		dispatch(setConstruction(data.data[idx]))
	}, [data, construction, active, isFetching, dispatch])

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
			<Select
				value={construction?.code || 'not_selected'}
				onChange={constructionHandler}
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
		</>
	)
}

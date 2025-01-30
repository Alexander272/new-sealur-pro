import { useEffect } from 'react'
import { MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getConstruction, getFiller, getFlangeType, setConstruction } from '../../putgSlice'
import { useGetPutgConstructionsQuery } from '../../putgApiSlice'

export const Construction = () => {
	const construction = useAppSelector(getConstruction)
	const filler = useAppSelector(getFiller)
	const flangeType = useAppSelector(getFlangeType)
	const dispatch = useAppDispatch()

	const { data, isFetching, isUninitialized } = useGetPutgConstructionsQuery(
		{ filler: filler?.baseId || '', flangeType: flangeType?.id || '' },
		{ skip: !filler?.baseId || !flangeType?.id }
	)

	useEffect(() => {
		if (data) dispatch(setConstruction(data.data[0]))
	}, [data, dispatch])

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

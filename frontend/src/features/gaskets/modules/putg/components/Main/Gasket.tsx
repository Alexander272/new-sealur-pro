import { MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'
import { useEffect } from 'react'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getFiller, getType, setType } from '../../putgSlice'
import { useGetPutgTypesQuery } from '../../putgApiSlice'

export const Gasket = () => {
	const type = useAppSelector(getType)
	const filler = useAppSelector(getFiller)
	const dispatch = useAppDispatch()

	const { data, isFetching, isUninitialized } = useGetPutgTypesQuery(filler?.baseId || '', { skip: !filler?.baseId })

	useEffect(() => {
		if (data) dispatch(setType(data.data[0]))
	}, [data, dispatch])

	const typeHandler = (event: SelectChangeEvent<string>) => {
		const type = data?.data.find(s => s.code === event.target.value)
		if (!type) return
		dispatch(setType(type))
	}

	return (
		<>
			<Typography fontWeight='bold' mt={1}>
				Тип прокладки
			</Typography>
			<Select
				value={type?.code || 'not_selected'}
				onChange={typeHandler}
				disabled={isFetching || isUninitialized}
			>
				<MenuItem disabled value='not_selected'>
					Выберите тип прокладки
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

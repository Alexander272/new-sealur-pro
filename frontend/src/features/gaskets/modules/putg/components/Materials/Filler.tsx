import { useEffect } from 'react'
import { MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getActive } from '@/features/card/cardSlice'
import { getFiller, getStandard, setMaterialFiller } from '../../putgSlice'
import { useGetPutgFillersQuery } from '../../putgApiSlice'

export const Filler = () => {
	const active = useAppSelector(getActive)
	const filler = useAppSelector(getFiller)
	const standard = useAppSelector(getStandard)
	const dispatch = useAppDispatch()

	const { data, isFetching } = useGetPutgFillersQuery(standard?.id || '', { skip: !standard?.id })

	useEffect(() => {
		if (data && !active?.id) dispatch(setMaterialFiller(data.data[0]))
	}, [data, active, dispatch])

	const fillerHandler = (event: SelectChangeEvent<string>) => {
		const filler = data?.data.find(s => s.id === event.target.value)
		if (!filler) return
		dispatch(setMaterialFiller(filler))
	}

	return (
		<>
			<Typography fontWeight='bold'>Материал прокладки</Typography>
			<Select
				value={filler?.id || 'not_selected'}
				onChange={fillerHandler}
				disabled={Boolean(active?.id) || isFetching}
				size='small'
				sx={{
					borderRadius: '12px',
					width: '100%',
				}}
			>
				<MenuItem disabled value='not_selected'>
					Выберите материал прокладки
				</MenuItem>

				{data?.data.map(f => (
					<MenuItem key={f.id} value={f.id}>
						{f.title} ({f.description} {f.description && ', '} {f.temperature})
					</MenuItem>
				))}
			</Select>
		</>
	)
}

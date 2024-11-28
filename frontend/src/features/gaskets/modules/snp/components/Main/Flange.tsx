import { MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getActive } from '@/features/card/cardSlice'
import { useGetFlangeTypesQuery } from '../../snpApiSlice'
import { getFlangeType, getStandard, getStandardId, setMainFlangeType, setMainSnpType } from '../../snpSlice'
import { useEffect } from 'react'

export const Flange = () => {
	const active = useAppSelector(getActive)
	const standardId = useAppSelector(getStandardId)
	const standard = useAppSelector(getStandard)
	const flange = useAppSelector(getFlangeType)

	const dispatch = useAppDispatch()

	const { data, isFetching } = useGetFlangeTypesQuery(
		{
			standardId: standardId,
			snpStandardId: standard?.standard.id || '',
		},
		{ skip: !standardId }
	)

	useEffect(() => {
		if (active || !data) return

		const flange = data.data[data.data.length - 1]
		dispatch(setMainFlangeType({ code: flange.code, title: flange.title }))
		const type = {
			id: flange.types[flange.types.length - 1].id,
			type: flange.types[flange.types.length - 1],
		}
		dispatch(setMainSnpType(type))
	}, [active, data, dispatch])

	const flangeTypeHandler = (event: SelectChangeEvent<string>) => {
		const flangeType = data?.data.find(f => f.code === event.target.value)
		if (!flangeType) return

		const type = {
			id: flangeType.types[flangeType.types.length - 1].id,
			type: flangeType.types[flangeType.types.length - 1],
		}
		dispatch(setMainSnpType(type))
		dispatch(setMainFlangeType({ code: event.target.value, title: flangeType.title }))
	}

	return (
		<>
			<Typography fontWeight='bold'>Тип фланца</Typography>
			<Select
				value={flange || 'not_selected'}
				onChange={flangeTypeHandler}
				disabled={Boolean(active?.id) || isFetching}
			>
				<MenuItem disabled value='not_selected'>
					Выберите тип фланца
				</MenuItem>

				{/* //TODO а почему я не сервере нужный порядок не задаю */}
				{[...(data?.data || [])].reverse().map(f => (
					<MenuItem key={f.id} value={f.code}>
						{f.title} {f.description && `(${f.description})`}
					</MenuItem>
				))}
			</Select>
		</>
	)
}

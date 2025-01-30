import { useEffect } from 'react'
import { MenuItem, Select, SelectChangeEvent, Skeleton, Typography } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getActive } from '@/features/card/cardSlice'
import { useGetSnpFlangeTypesQuery } from '../../snpApiSlice'
import { getFlangeType, getStandardId, setMainFlangeType, setMainSnpType } from '../../snpSlice'

export const Flange = () => {
	const active = useAppSelector(getActive)
	const standardId = useAppSelector(getStandardId)
	const flange = useAppSelector(getFlangeType)

	const dispatch = useAppDispatch()

	const { data, isFetching } = useGetSnpFlangeTypesQuery(
		{ standardId: standardId },
		{ skip: !standardId || standardId == 'not_selected' }
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
			<Typography fontWeight='bold' mt={1}>
				Тип фланца
			</Typography>
			{isFetching ? (
				<Skeleton animation='wave' variant='rounded' height={40} sx={{ borderRadius: 3 }} />
			) : (
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
			)}
		</>
	)
}

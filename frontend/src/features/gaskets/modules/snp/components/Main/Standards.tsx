import { useEffect } from 'react'
import { FormControl, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getActive } from '@/features/card/cardSlice'
import { useGetStandardQuery } from '../../snpApiSlice'
import { getStandardId, setMainStandard } from '../../snpSlice'

export const Standards = () => {
	const active = useAppSelector(getActive)
	const standardId = useAppSelector(getStandardId)
	const dispatch = useAppDispatch()

	const { data, isFetching } = useGetStandardQuery(null)

	useEffect(() => {
		if (data) dispatch(setMainStandard({ id: data.data[0].id, standard: data.data[0] }))
	}, [data, dispatch])

	const standardHandler = (event: SelectChangeEvent<string>) => {
		const standard = data?.data.find(s => s.id === event.target.value)
		if (!standard) return
		dispatch(setMainStandard({ id: standard.id, standard: standard }))
	}

	return (
		<>
			<Typography fontWeight='bold'>Стандарт на прокладку / стандарт на фланец</Typography>
			<FormControl size='small'>
				<Select
					value={standardId || 'not_selected'}
					onChange={standardHandler}
					disabled={Boolean(active?.id) || isFetching}
				>
					{/* <MenuItem disabled value='not_selected'>
								Выберите стандарт
							</MenuItem>
							{standards?.data.map(s => (
								<MenuItem key={s.id} value={s.id}>
									{s.standard.title} {s.flangeStandard.title && '/'} {s.flangeStandard.title}
								</MenuItem>
							))} */}

					<MenuItem disabled value='not_selected'>
						<Typography
							sx={{
								display: 'flex',
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								width: '100%',
								gap: '2%',
							}}
						>
							<Typography variant='body1' component='span' sx={{ flexBasis: '50%' }}>
								Стандарт на прокладку
							</Typography>

							<Typography
								variant='body1'
								component='span'
								sx={{ flexBasis: '50%', overflow: 'hidden', textOverflow: 'ellipsis' }}
							>
								Стандарт на фланец
							</Typography>
						</Typography>
					</MenuItem>

					{data?.data.map(s => (
						<MenuItem key={s.id} value={s.id}>
							<Typography
								sx={{
									display: 'flex',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									width: '100%',
									gap: '2%',
								}}
							>
								<Typography
									variant='body1'
									component='span'
									sx={{ flexBasis: '50%', overflow: 'hidden', textOverflow: 'ellipsis' }}
								>
									{s.standard.title}
								</Typography>

								<Typography
									variant='body1'
									component='span'
									sx={{ flexBasis: '50%', overflow: 'hidden', textOverflow: 'ellipsis' }}
								>
									{s.flangeStandard.title}
								</Typography>
							</Typography>
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</>
	)
}

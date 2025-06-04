import { useCallback } from 'react'
// import { FormControl, MenuItem, Select, SelectChangeEvent, Skeleton, Typography } from '@mui/material'

import type { IPutgStandard } from '../../types/main'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
// import { getActive } from '@/features/card/cardSlice'
import { Standards as BaseStandards } from '@/features/gaskets/components/main/Standard/Standards'
import { getConfiguration, getStandard, setMainStandard } from '../../putgSlice'
import { useGetPutgStandardQuery } from '../../putgApiSlice'

export const Standards = () => {
	// const active = useAppSelector(getActive)
	const standard = useAppSelector(getStandard)
	const configuration = useAppSelector(getConfiguration)
	const dispatch = useAppDispatch()

	const { data, isFetching } = useGetPutgStandardQuery(null)

	// useEffect(() => {
	// 	if (!data || active?.id || isFetching) return
	// 	dispatch(setMainStandard(data.data[0]))
	// }, [data, active, isFetching, dispatch])
	// useEffect(() => {
	// 	if (!data || !active || isFetching) return
	// 	let idx = data.data.findIndex(c => c.id === standard?.id)
	// 	if (idx == -1) idx = 0
	// 	dispatch(setMainStandard(data.data[idx]))
	// }, [data, active, isFetching, standard, dispatch])

	// useEffect(() => {
	// 	if (!data || active?.id || isFetching) return
	// 	if (configuration?.code != 'round') dispatch(setMainStandard(data.data[data.data.length - 1]))
	// 	else dispatch(setMainStandard(data.data[0]))
	// }, [configuration, data, active, isFetching, dispatch])

	// const standardHandler = (event: SelectChangeEvent<string>) => {
	// 	const standard = data?.data.find(s => s.id === event.target.value)
	// 	if (!standard) return
	// 	dispatch(setMainStandard(standard))
	// }

	const changeHandler = useCallback((value: IPutgStandard) => dispatch(setMainStandard(value)), [dispatch])

	// if (configuration?.code != 'round') return null
	return (
		<BaseStandards
			data={data?.data || []}
			isFetching={isFetching}
			configuration={configuration?.code}
			value={standard?.id}
			onChange={changeHandler}
			hidden={configuration?.code != 'round'}
		/>
	)
	// return (
	// 	<>
	// 		<Typography fontWeight='bold' mt={1}>
	// 			Стандарт на прокладку / стандарт на фланец
	// 		</Typography>
	// 		{isFetching || isUninitialized ? (
	// 			<Skeleton animation='wave' variant='rounded' height={41} sx={{ borderRadius: 3 }} />
	// 		) : (
	// 			<FormControl size='small'>
	// 				<Select
	// 					value={standard?.id || 'not_selected'}
	// 					onChange={standardHandler}
	// 					disabled={Boolean(active?.id) || isFetching}
	// 				>
	// 					{/* <MenuItem disabled value='not_selected'>
	// 							Выберите стандарт
	// 						</MenuItem>
	// 						{standards?.data.map(s => (
	// 							<MenuItem key={s.id} value={s.id}>
	// 								{s.standard.title} {s.flangeStandard.title && '/'} {s.flangeStandard.title}
	// 							</MenuItem>
	// 						))} */}

	// 					<MenuItem disabled value='not_selected'>
	// 						<Typography
	// 							sx={{
	// 								display: 'flex',
	// 								overflow: 'hidden',
	// 								textOverflow: 'ellipsis',
	// 								width: '100%',
	// 								gap: '2%',
	// 							}}
	// 						>
	// 							<Typography variant='body1' component='span' sx={{ flexBasis: '50%' }}>
	// 								Стандарт на прокладку
	// 							</Typography>

	// 							<Typography
	// 								variant='body1'
	// 								component='span'
	// 								sx={{ flexBasis: '50%', overflow: 'hidden', textOverflow: 'ellipsis' }}
	// 							>
	// 								Стандарт на фланец
	// 							</Typography>
	// 						</Typography>
	// 					</MenuItem>

	// 					{data?.data.map(s => (
	// 						<MenuItem key={s.id} value={s.id}>
	// 							<Typography
	// 								sx={{
	// 									display: 'flex',
	// 									overflow: 'hidden',
	// 									textOverflow: 'ellipsis',
	// 									width: '100%',
	// 									gap: '2%',
	// 								}}
	// 							>
	// 								<Typography
	// 									variant='body1'
	// 									component='span'
	// 									sx={{ flexBasis: '50%', overflow: 'hidden', textOverflow: 'ellipsis' }}
	// 								>
	// 									{s.standard.title}
	// 								</Typography>

	// 								<Typography
	// 									variant='body1'
	// 									component='span'
	// 									sx={{ flexBasis: '50%', overflow: 'hidden', textOverflow: 'ellipsis' }}
	// 								>
	// 									{s.flangeStandard.title}
	// 								</Typography>
	// 							</Typography>
	// 						</MenuItem>
	// 					))}
	// 				</Select>
	// 			</FormControl>
	// 		)}
	// 	</>
	// )
}

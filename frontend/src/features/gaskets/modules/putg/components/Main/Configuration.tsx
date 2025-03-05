import { useEffect } from 'react'
import { Skeleton, Typography } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getActive } from '@/features/card/cardSlice'
import { RadioGroup, RadioItem } from '@/components/RadioGroup/RadioGroup'
import { useGetPutgConfigurationsQuery } from '../../putgApiSlice'
import { getConfiguration, setMainConfiguration } from '../../putgSlice'

export const Configuration = () => {
	const active = useAppSelector(getActive)
	const conf = useAppSelector(getConfiguration)
	const dispatch = useAppDispatch()

	const { data, isFetching, isUninitialized } = useGetPutgConfigurationsQuery(null)

	useEffect(() => {
		if (data && !active?.id && !isFetching) dispatch(setMainConfiguration(data.data[0]))
	}, [data, dispatch, isFetching, active])
	useEffect(() => {
		if (!data || !active || isFetching) return
		let idx = conf ? data.data.findIndex(c => c.id === conf.id) : 0
		if (idx == -1) idx = 0
		dispatch(setMainConfiguration(data.data[idx]))
	}, [data, conf, active, isFetching, dispatch])

	const gasketHandler = (type: string) => {
		if (!data) return
		const configuration = data.data.find(s => s.code === type)
		if (!configuration) return
		dispatch(setMainConfiguration(configuration))
	}

	return (
		<>
			<Typography fontWeight='bold'>Конфигурация прокладки</Typography>
			{isFetching || isUninitialized ? (
				<Skeleton animation='wave' variant='rounded' height={41} sx={{ borderRadius: 3 }} />
			) : (
				<RadioGroup onChange={gasketHandler} disabled={Boolean(active?.id) || isFetching}>
					{data?.data.map(c => (
						<RadioItem key={c.id} value={c.code} active={c.code == conf?.code}>
							{c.title}
						</RadioItem>
					))}
				</RadioGroup>
			)}
		</>
	)
}

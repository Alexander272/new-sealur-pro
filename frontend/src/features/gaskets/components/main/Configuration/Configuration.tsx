import { FC, useEffect } from 'react'
import { Skeleton, Typography } from '@mui/material'

import type { IConfiguration } from '@/features/gaskets/modules/wave/types/main'
import { useAppSelector } from '@/hooks/redux'
import { getActive } from '@/features/card/cardSlice'
import { RadioGroup, RadioItem } from '@/components/RadioGroup/RadioGroup'

type Props = {
	data: IConfiguration[]
	isFetching: boolean
	value?: string
	onChange: (value: IConfiguration) => void
}

export const BaseConfiguration: FC<Props> = ({ data, isFetching, value, onChange }) => {
	const active = useAppSelector(getActive)

	useEffect(() => {
		if (data.length && !active?.id && !isFetching) onChange(data[0])
	}, [data, onChange, isFetching, active])
	useEffect(() => {
		if (!data.length || !active || isFetching) return
		let idx = value ? data.findIndex(c => c.id === value) : 0
		if (idx == -1) idx = 0
		onChange(data[idx])
	}, [data, value, active, isFetching, onChange])

	const gasketHandler = (type: string) => {
		if (!data) return
		const configuration = data.find(s => s.id === type)
		if (!configuration) return
		onChange(configuration)
	}

	return (
		<>
			<Typography fontWeight='bold'>Конфигурация прокладки</Typography>
			{isFetching ? (
				<Skeleton animation='wave' variant='rounded' height={41} sx={{ borderRadius: 3 }} />
			) : (
				<RadioGroup onChange={gasketHandler} disabled={Boolean(active?.id) || isFetching}>
					{data.map(c => (
						<RadioItem key={c.id} value={c.id} active={c.id == value}>
							{c.title}
						</RadioItem>
					))}
				</RadioGroup>
			)}
		</>
	)
}

import { FC, useEffect } from 'react'
import { MenuItem, Select, SelectChangeEvent, Skeleton, Typography } from '@mui/material'

import type { IPlating } from '../../modules/wave/types/material'
import type { IFiller } from '../../modules/putg/types/materials'
import { useAppSelector } from '@/hooks/redux'
import { getActive } from '@/features/card/cardSlice'

type Union = IFiller & IPlating

type Props = {
	data: (IFiller | IPlating)[]
	isFetching: boolean
	title?: string
	value?: string
	onChange: (value: Union) => void
}

export const BaseFiller: FC<Props> = ({ data, isFetching, title, value, onChange }) => {
	const active = useAppSelector(getActive)

	useEffect(() => {
		if (data.length && !active?.id && !isFetching) onChange(data[0] as Union)
	}, [data, active, isFetching, onChange])

	useEffect(() => {
		if (!data.length || !active || isFetching) return
		let idx = data.findIndex(c => c.id === value)
		if (idx == -1) idx = 0
		onChange(data[idx] as Union)
	}, [data, value, active, isFetching, onChange])

	const fillerHandler = (event: SelectChangeEvent<string>) => {
		const filler = data.find(s => s.id === event.target.value)
		if (!filler) return
		onChange(filler as Union)
	}

	return (
		<>
			<Typography fontWeight='bold'>{title || 'Материал прокладки'}</Typography>

			{isFetching ? (
				<Skeleton animation='wave' variant='rounded' height={40} sx={{ borderRadius: 3 }} />
			) : (
				<Select
					value={value || 'not_selected'}
					onChange={fillerHandler}
					disabled={Boolean(active?.id) || isFetching}
				>
					<MenuItem disabled value='not_selected'>
						{title ? 'Выберите ' + title.toLowerCase() : 'Выберите материал прокладки'}
					</MenuItem>

					{data.map(f => (
						<MenuItem key={f.id} value={f.id}>
							{f.title} ({f.description}
							{f.description && ', '}
							{f.temperature})
						</MenuItem>
					))}
				</Select>
			)}
		</>
	)
}

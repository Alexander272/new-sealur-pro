import { FC, useEffect } from 'react'
import { MenuItem, Select, SelectChangeEvent, Skeleton, Typography } from '@mui/material'

import type { IFlangeType } from '@/features/gaskets/modules/putg/types/main'
import { useAppSelector } from '@/hooks/redux'
import { getActive } from '@/features/card/cardSlice'

type Props = {
	data: IFlangeType[]
	isFetching: boolean
	value?: string
	onChange: (value: IFlangeType) => void
}

export const BaseFlangeType: FC<Props> = ({ data, isFetching, value, onChange }) => {
	const active = useAppSelector(getActive)

	useEffect(() => {
		if (data && !active?.id && !isFetching) onChange(data[0])
	}, [data, active, isFetching, onChange])
	useEffect(() => {
		if (!data || !active || isFetching) return
		let idx = data.findIndex(c => c.id === value)
		if (idx == -1) idx = 0
		onChange(data[idx])
	}, [data, value, isFetching, active, onChange])

	const flangeTypeHandler = (event: SelectChangeEvent<string>) => {
		const flangeType = data.find(f => f.id === event.target.value)
		if (!flangeType) return
		onChange(flangeType)
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
					value={value || 'not_selected'}
					onChange={flangeTypeHandler}
					disabled={Boolean(active?.id) || isFetching}
				>
					<MenuItem disabled value='not_selected'>
						Выберите тип фланца
					</MenuItem>

					{data.map(f => (
						<MenuItem key={f.id} value={f.id}>
							{f.title}
						</MenuItem>
					))}
				</Select>
			)}
		</>
	)
}

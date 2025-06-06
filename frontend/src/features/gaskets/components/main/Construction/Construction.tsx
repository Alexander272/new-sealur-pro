import { FC, useEffect } from 'react'
import { MenuItem, Select, SelectChangeEvent, Skeleton, Typography } from '@mui/material'

import type { IConstruction as ISConstruction } from '@/features/gaskets/modules/serrated/types/main'
import type { IConstruction } from '@/features/gaskets/modules/putg/types/materials'
import { useAppSelector } from '@/hooks/redux'
import { getActive } from '@/features/card/cardSlice'

type Union = ISConstruction & IConstruction

type Props = {
	data: (ISConstruction | IConstruction)[]
	isFetching: boolean
	value?: { id: string; code?: string }
	onChange: (value: Union) => void
	type?: string
	hidden?: boolean
}

export const BaseConstruction: FC<Props> = ({ data, isFetching, value, onChange, type, hidden }) => {
	const active = useAppSelector(getActive)

	useEffect(() => {
		if (!data.length || active?.id || isFetching) return
		let idx = value ? data.findIndex(c => c.code === value.code) : 0
		if (idx == -1) idx = 0
		onChange(data[idx] as Union)
	}, [data, active, isFetching, onChange, value])

	useEffect(() => {
		if (!data.length || !active || isFetching || !type) return
		let idx = value ? data.findIndex(c => c.id === value.id) : 0
		if (idx == -1) idx = 0
		onChange(data[idx] as Union)
	}, [data, value, active, isFetching, onChange, type])

	const constructionHandler = (event: SelectChangeEvent<string>) => {
		const construction = data.find(s => s.code === event.target.value)
		if (!construction) return
		onChange(construction as Union)
	}

	if (hidden) return null
	return (
		<>
			<Typography fontWeight='bold' mt={1}>
				Тип конструкции
			</Typography>

			{isFetching ? (
				<Skeleton animation='wave' variant='rounded' height={40} sx={{ borderRadius: 3 }} />
			) : (
				<Select value={value?.code || 'not_selected'} onChange={constructionHandler} disabled={isFetching}>
					<MenuItem disabled value='not_selected'>
						Выберите тип конструкции
					</MenuItem>

					{data.map(f => (
						<MenuItem key={f.id} value={f.code}>
							{f.code} - {f.title}
						</MenuItem>
					))}
				</Select>
			)}
		</>
	)
}

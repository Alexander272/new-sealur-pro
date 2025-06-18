import { MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'
import { FC, useEffect } from 'react'

import type { ISerratedType } from '@/features/gaskets/modules/serrated/types/main'
import type { IJacketedType } from '@/features/gaskets/modules/jacketed/types/main'
import type { IWaveType } from '@/features/gaskets/modules/wave/types/main'
import type { IPutgType } from '@/features/gaskets/modules/putg/types/materials'
import { useAppSelector } from '@/hooks/redux'
import { getActive } from '@/features/card/cardSlice'

type Union = ISerratedType & IWaveType & IPutgType & IJacketedType

type Props = {
	data: (ISerratedType | IWaveType | IPutgType | IJacketedType)[]
	isFetching: boolean
	configuration?: string
	value?: string
	onChange: (value: Union) => void
}

export const BaseGasket: FC<Props> = ({ data, isFetching, value, onChange, configuration }) => {
	const active = useAppSelector(getActive)

	useEffect(() => {
		if (data.length && !active?.id && !isFetching) onChange(data[0] as Union)
	}, [data, active, isFetching, configuration, onChange])
	useEffect(() => {
		if (!data.length || !active || isFetching) return
		let idx = data.findIndex(c => c.id === value)
		if (idx == -1) idx = 0
		onChange(data[idx] as Union)
	}, [data, value, active, isFetching, onChange])

	const typeHandler = (event: SelectChangeEvent<string>) => {
		const type = data.find(s => s.id === event.target.value)
		if (!type) return
		onChange(type as Union)
	}

	return (
		<>
			<Typography fontWeight='bold' mt={1}>
				Тип прокладки
			</Typography>
			<Select value={value || 'not_selected'} onChange={typeHandler} disabled={isFetching}>
				<MenuItem disabled value='not_selected'>
					Выберите тип прокладки
				</MenuItem>

				{data.map(f => (
					<MenuItem key={f.id} value={f.id}>
						{f.code} - {f.title}
					</MenuItem>
				))}
			</Select>
		</>
	)
}

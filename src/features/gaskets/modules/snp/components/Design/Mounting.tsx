import { ChangeEvent, FC } from 'react'
import { MenuItem, Select, SelectChangeEvent, Stack } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { Checkbox } from '@/components/Checkbox/Checkbox'
import { getMounting, setDesignMounting } from '../../snpSlice'
import { useGetFasteningsQuery } from '../../snpApiSlice'

type Props = {
	disabled?: boolean
}

export const Mounting: FC<Props> = ({ disabled }) => {
	const mounting = useAppSelector(getMounting)

	const dispatch = useAppDispatch()

	const { data } = useGetFasteningsQuery(null)

	const mountingHandler = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(setDesignMounting({ hasMounting: event.target.checked }))
	}

	const mountingTitleHandler = (event: SelectChangeEvent<string>) => {
		dispatch(setDesignMounting({ code: event.target.value }))
	}

	return (
		<Stack direction='row' spacing={2} marginTop={1} marginBottom={3}>
			<Checkbox
				id='mounting'
				name='mounting'
				label='Крепление на вертикальном фланце'
				checked={mounting.hasMounting}
				disabled={disabled}
				onChange={mountingHandler}
			/>

			{mounting.hasMounting && (
				<Select
					value={mounting.code || 'not_selected'}
					onChange={mountingTitleHandler}
					disabled={disabled}
					size='small'
					sx={{
						borderRadius: '12px',
					}}
				>
					<MenuItem value='not_selected' disabled>
						Выберите тип крепления
					</MenuItem>

					{data?.data.map(m => (
						<MenuItem key={m.id} value={m.title}>
							{m.title}
						</MenuItem>
					))}
				</Select>
			)}
		</Stack>
	)
}

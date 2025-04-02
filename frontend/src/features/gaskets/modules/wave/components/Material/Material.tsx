import { FC } from 'react'
import { MenuItem, Select, Skeleton, Typography } from '@mui/material'

type Props = {
	title: string
	// type: TypeMaterial
	disabled?: boolean
	isEmpty?: boolean
}

export const Material: FC<Props> = ({ title, disabled }) => {
	const isFetching = false
	const isUninitialized = false

	return (
		<>
			<Typography fontWeight='bold' mt={1}>
				{title}
			</Typography>

			{isFetching || isUninitialized ? (
				<Skeleton animation='wave' variant='rounded' height={40} sx={{ borderRadius: 3 }} />
			) : (
				<Select
					// value={material?.[type]?.materialId || 'not_selected'}
					// onChange={materialHandler}
					value={'not_selected'}
					disabled={disabled || isFetching}
					fullWidth
				>
					<MenuItem value='not_selected'>Выберите материал</MenuItem>

					{/* {data?.data?.[type]?.map(m => (
						<MenuItem key={m.id} value={m.materialId}>
							{m.title}
						</MenuItem>
					))} */}
				</Select>
			)}
		</>
	)
}

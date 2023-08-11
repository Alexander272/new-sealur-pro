import { FC } from 'react'
import { Stack, TextField, Typography } from '@mui/material'

type Props = {
	hasThickness?: boolean
}

export const CustomSize: FC<Props> = ({ hasThickness }) => {
	return (
		<Stack direction={'row'} spacing={1} margin={1} maxWidth={'550px'} width={'100%'} alignItems={'center'}>
			<TextField label='Нар. диаметр, мм' size='small' />
			<Typography>×</Typography>
			<TextField label='Вн. диаметр, мм' size='small' />

			{hasThickness && (
				<>
					<Typography>×</Typography> <TextField label='Высота, мм' size='small' />
				</>
			)}
		</Stack>
	)
}

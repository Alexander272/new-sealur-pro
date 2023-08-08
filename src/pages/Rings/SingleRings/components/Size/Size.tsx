import { Column, SizeContainer } from '@/pages/Gasket/gasket.style'
import { Typography } from '@mui/material'

export const Size = () => {
	return (
		<SizeContainer>
			<Column>
				<Typography>Размеры</Typography>
			</Column>
			<Column>
				<Typography>Чертеж?</Typography>
			</Column>
		</SizeContainer>
	)
}

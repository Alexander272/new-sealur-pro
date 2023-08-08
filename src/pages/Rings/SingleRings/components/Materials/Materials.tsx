import { AsideContainer } from '@/pages/Gasket/gasket.style'
import { MenuItem, Select, Typography } from '@mui/material'

export const Materials = () => {
	return (
		<AsideContainer>
			<Typography fontWeight='bold'>фольга ТРГ</Typography>
			<Select value={'not_selected'} size='small' sx={{ borderRadius: '12px', width: '100%' }}>
				<MenuItem disabled value='not_selected'>
					Выберите фольгу
				</MenuItem>
			</Select>

			<Typography fontWeight='bold' mt={1}>
				Тип модифицирующей добавки
			</Typography>
			<Select value={'not_selected'} size='small' sx={{ borderRadius: '12px', width: '100%' }}>
				<MenuItem disabled value='not_selected'>
					Выберите мод. добавку
				</MenuItem>
			</Select>
		</AsideContainer>
	)
}

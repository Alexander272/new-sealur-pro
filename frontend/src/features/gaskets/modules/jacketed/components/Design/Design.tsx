import { Typography } from '@mui/material'

import { useAppSelector } from '@/hooks/redux'
import { getRole } from '@/features/user/userSlice'
import { AsideContainer } from '@/features/gaskets/components/Skeletons/gasket.style'
import { Files } from './Files'
import { Jumper } from './Jumper'
import { getDesignErrors } from '../../jacketedSlice'

export const Design = () => {
	const role = useAppSelector(getRole)
	const errors = useAppSelector(getDesignErrors)

	return (
		<AsideContainer>
			<Typography fontWeight='bold'>Конструктивные элементы</Typography>

			<Jumper />
			<Files disabled={role != 'user'} />

			{Object.values(errors).some(v => v) && (
				<Typography sx={{ marginTop: 1, color: 'var(--danger-color)', fontSize: '1.4rem' }}>
					К заявке приложите файл с чертежом.
				</Typography>
			)}
		</AsideContainer>
	)
}

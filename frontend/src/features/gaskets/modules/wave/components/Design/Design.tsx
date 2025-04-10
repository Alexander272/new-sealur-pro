import { Typography } from '@mui/material'

import { useAppSelector } from '@/hooks/redux'
import { getRole } from '@/features/user/userSlice'
import { AsideContainer } from '@/features/gaskets/components/Skeletons/gasket.style'
import { Holes } from './Holes'
import { Coating } from './Coating'
import { Jumper } from './Jumper'
import { Files } from './Files'
import { Retainer } from './Retainer'
import { getDesignErrors } from '../../waveSlice'

export const Design = () => {
	const role = useAppSelector(getRole)
	const errors = useAppSelector(getDesignErrors)

	return (
		<AsideContainer>
			<Typography fontWeight='bold'>Конструктивные элементы</Typography>

			<Holes />
			<Coating />
			<Retainer />
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

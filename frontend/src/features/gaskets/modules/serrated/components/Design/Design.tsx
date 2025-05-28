import { Typography } from '@mui/material'

import { useAppSelector } from '@/hooks/redux'
import { getRole } from '@/features/user/userSlice'
import { AsideContainer } from '@/features/gaskets/components/Skeletons/gasket.style'
import { Holes } from './Holes'
import { Coating } from './Coating'
import { Jumper } from './Jumper'
import { Files } from './Files'
import { Retainer } from './Retainer'
import { getDesignErrors, getStandard } from '../../serratedSlice'
import { useGetSerratedInfoQuery } from '../../serratedApiSlice'

export const Design = () => {
	const role = useAppSelector(getRole)
	const standard = useAppSelector(getStandard)
	const errors = useAppSelector(getDesignErrors)

	const { data } = useGetSerratedInfoQuery(standard?.id || '', { skip: !standard?.id })

	return (
		<AsideContainer>
			<Typography fontWeight='bold'>Конструктивные элементы</Typography>

			<Holes disabled={data?.data ? !data?.data?.hasHole : false} />
			<Coating disabled={data?.data ? !data?.data?.hasCoating : false} />
			<Retainer disabled={data?.data ? !data?.data?.withRetainer : false} />
			<Jumper disabled={data?.data ? !data?.data?.hasJumper : false} />
			<Files disabled={role != 'user'} />

			{Object.values(errors).some(v => v) && (
				<Typography sx={{ marginTop: 1, color: 'var(--danger-color)', fontSize: '1.4rem' }}>
					К заявке приложите файл с чертежом.
				</Typography>
			)}
		</AsideContainer>
	)
}

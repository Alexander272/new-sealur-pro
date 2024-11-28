import { Typography } from '@mui/material'

import { useAppSelector } from '@/hooks/redux'
import { getRole } from '@/features/user/userSlice'
import { AsideContainer } from '@/features/gaskets/components/Skeletons/gasket.style'
import { getHasDesignError, getSnpTypeId } from '../../snpSlice'
import { useGetSnpInfoQuery } from '../../snpApiSlice'
import { Jumper } from './Jumper'
import { Holes } from './Holes'
import { Mounting } from './Mounting'
import { Files } from './Files'

export const Design = () => {
	const role = useAppSelector(getRole)
	const snp = useAppSelector(getSnpTypeId)
	const hasDesignError = useAppSelector(getHasDesignError)

	const { data, isFetching } = useGetSnpInfoQuery(snp, { skip: snp == 'not_selected' })

	return (
		<AsideContainer>
			<Typography fontWeight='bold'>Конструктивные элементы</Typography>

			<Jumper disabled={!data?.data.hasJumper || isFetching} />
			<Holes disabled={!data?.data.hasHole || isFetching} />
			<Mounting disabled={!data?.data.hasMounting || isFetching} />
			<Files disabled={role != 'user'} />

			{hasDesignError && (
				<Typography sx={{ marginTop: 1, color: 'var(--danger-color)', fontSize: '1.4rem' }}>
					К заявке приложите файл с чертежом.
				</Typography>
			)}
		</AsideContainer>
	)
}

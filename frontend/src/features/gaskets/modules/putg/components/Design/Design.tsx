import { Typography } from '@mui/material'

import { useAppSelector } from '@/hooks/redux'
import { AsideContainer } from '@/features/gaskets/components/Skeletons/gasket.style'
import { getRole } from '@/features/user/userSlice'
import { useGetPutgInfoQuery } from '../../putgApiSlice'
import { getFiller, getHasDesignError } from '../../putgSlice'
import { Holes } from './Holes'
import { Jumper } from './Jumper'
import { Coating } from './Coating'
import { Removable } from './Removable'
import { Files } from './Files'

export const Design = () => {
	const role = useAppSelector(getRole)
	const filler = useAppSelector(getFiller)
	const hasDesignError = useAppSelector(getHasDesignError)

	const { data, isFetching } = useGetPutgInfoQuery(filler?.id || '', { skip: !filler?.id })

	return (
		<AsideContainer>
			<Typography fontWeight='bold'>Конструктивные элементы</Typography>

			<Holes disabled={!data?.data.hasHole || isFetching} />
			<Coating disabled={!data?.data.hasCoating || isFetching} />
			<Removable disabled={!data?.data.hasRemovable || isFetching} />
			<Jumper disabled={!data?.data.hasJumper || isFetching} />
			<Files disabled={role != 'user'} />

			{hasDesignError && (
				<Typography sx={{ marginTop: 1, color: 'var(--danger-color)', fontSize: '1.4rem' }}>
					К заявке приложите файл с чертежом.
				</Typography>
			)}
		</AsideContainer>
	)
}

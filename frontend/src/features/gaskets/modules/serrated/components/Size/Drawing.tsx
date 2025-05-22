import { Skeleton, Typography } from '@mui/material'

import { useAppSelector } from '@/hooks/redux'
import { Column, ImageContainer } from '@/features/gaskets/components/Skeletons/gasket.style'
import { getConstruction, getType } from '../../serratedSlice'
import { StandardImage } from './Image/StandardImage'
import { Dimensions } from './Dimensions/Dimensions'

export const Drawing = () => {
	const type = useAppSelector(getType)
	const construction = useAppSelector(getConstruction)

	return (
		<Column width={60}>
			<Typography fontWeight='bold'>Чертеж прокладки</Typography>
			{!construction || !type ? (
				<Skeleton animation='wave' variant='rounded' width={'100%'} height={222} />
			) : (
				<ImageContainer>
					<StandardImage type={type} construction={construction} />
					<Dimensions />
				</ImageContainer>
			)}
		</Column>
	)
}

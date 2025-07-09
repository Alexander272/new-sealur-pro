import { Skeleton, Typography } from '@mui/material'

import { useAppSelector } from '@/hooks/redux'
import { Column, Image, ImageContainer } from '@/features/gaskets/components/Skeletons/gasket.style'
import { getConfiguration, getConstruction, getType } from '../../waveSlice'
import { StandardImage } from './Image/StandardImage'
import { Dimensions } from './Dimensions/Dimensions'
import { NotRoundDimensions } from './Dimensions/NotRoundDimensions'

import ovalImage from '@/assets/putg/ov.webp'
import rectangularImage from '@/assets/putg/pr.webp'
import { NotStandardImage } from './Image/NotStandardImage'

const images = {
	oval: ovalImage,
	rectangular: rectangularImage,
}

export const Drawing = () => {
	const configuration = useAppSelector(getConfiguration)
	const type = useAppSelector(getType)
	const construction = useAppSelector(getConstruction)

	return (
		<Column width={60}>
			<Typography fontWeight='bold'>Чертеж прокладки</Typography>
			{!configuration || !construction || !type ? (
				<Skeleton animation='wave' variant='rounded' width={'100%'} height={222} />
			) : (
				<>
					{configuration?.code == 'round' && (
						<ImageContainer padding='0'>
							<StandardImage type={type} construction={construction} />
							<Dimensions />
						</ImageContainer>
					)}

					{configuration?.code != 'round' && (
						<>
							<ImageContainer padding='0'>
								<NotStandardImage type={type} construction={construction} />
							</ImageContainer>

							<Typography fontWeight='bold'>Размеры прокладки</Typography>
							<ImageContainer padding='0 20px'>
								<Image
									src={images[configuration?.code || 'rectangular']}
									alt='gasket drawing'
									maxWidth={'400px'}
									width={600}
									height={255}
								/>
								<NotRoundDimensions />
							</ImageContainer>
						</>
					)}
				</>
			)}
		</Column>
	)
}

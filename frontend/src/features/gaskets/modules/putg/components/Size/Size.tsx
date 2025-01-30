import { Skeleton, Typography } from '@mui/material'

import { Column, Image, ImageContainer, SizeContainer } from '@/features/gaskets/components/Skeletons/gasket.style'
import { useAppSelector } from '@/hooks/redux'
import { getConfiguration, getConstruction, getStandard, getType } from '../../putgSlice'
import { StandardImage } from './Image/StandardImage'
import { SizesBlock } from './SizeBlock/SizesBlock'
import { NotStandardImage } from './Image/NotStandardImage'
import { AnotherSizeBlock } from './SizeBlock/AnotherSizeBlock'
import { Standard } from './Standard/Standard'
import { Another } from './Another/Another'

import ovalImage from '@/assets/putg/ov.webp'
import rectangularImage from '@/assets/putg/pr.webp'
import { Configuration } from './Configuration/Configuration'
import { SizeSkeleton } from '@/features/gaskets/components/Skeletons/SizeSkeleton'

const images = {
	oval: ovalImage,
	rectangular: rectangularImage,
}

export const Size = () => {
	const configuration = useAppSelector(getConfiguration)
	const construction = useAppSelector(getConstruction)
	const type = useAppSelector(getType)
	const standard = useAppSelector(getStandard)

	return (
		<SizeContainer>
			{configuration ? (
				<Column width={40}>
					{standard?.flangeStandard.code ? (
						<Standard />
					) : configuration?.code === 'round' ? (
						<Another />
					) : (
						<Configuration />
					)}
				</Column>
			) : (
				<SizeSkeleton />
			)}

			<Column width={60}>
				<Typography fontWeight='bold'>Чертеж прокладки</Typography>
				{!configuration || !construction || !type ? (
					<Skeleton animation='wave' variant='rounded' width={'100%'} height={222} />
				) : (
					<>
						{configuration?.code == 'round' && (
							<ImageContainer>
								<StandardImage type={type} construction={construction} />
								<SizesBlock />
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
									<AnotherSizeBlock />
								</ImageContainer>
							</>
						)}
					</>
				)}
			</Column>
		</SizeContainer>
	)
}

import { Typography } from '@mui/material'

import { useAppSelector } from '@/hooks/redux'
import { Column, SizeContainer } from '@/features/gaskets/components/Skeletons/gasket.style'
import { Standard } from './Standard/Standard'
import { getStandard } from '../../waveSlice'

export const Size = () => {
	const standard = useAppSelector(getStandard)

	return (
		<SizeContainer>
			<Column width={45}>{standard?.flangeStandard.code ? <Standard /> : null}</Column>

			<Column width={55}>
				<Typography fontWeight='bold'>Чертеж прокладки</Typography>
				{/* {!snp ? (
					<Skeleton animation='wave' variant='rounded' width={'100%'} height={245} />
				) : (
					<ImageContainer>
						<Image
							src={images[snp.title as 'Д']}
							alt='gasket drawing'
							maxWidth={'550px'}
							width={600}
							height={255}
						/>

						<SizesBlockSnp />
						<BacklightSnp />
					</ImageContainer>
				)} */}
			</Column>
		</SizeContainer>
	)
}

import { FC } from 'react'
import { Skeleton, Typography } from '@mui/material'

import { useAppSelector } from '@/hooks/redux'
import { Column, Image, ImageContainer, SizeContainer } from '@/features/gaskets/components/Skeletons/gasket.style'
import { SizeSkeleton } from '@/features/gaskets/components/Skeletons/SizeSkeleton'
import { getSnpType, getStandard } from '../../snpSlice'
import { BacklightSnp } from './Backlight/BacklightSnp'
import { SizesBlockSnp } from './SizesBlock/SizesBlock'
import { Another } from './Another/Another'
import { Standard } from './Standard/Standard'

import SnpD from '@/assets/snp/SNP-P-E.webp'
import SnpG from '@/assets/snp/SNP-P-D.webp'
import SnpV from '@/assets/snp/SNP-P-C.webp'
import SnpB from '@/assets/snp/SNP-P-AB.webp'
import SnpA from '@/assets/snp/SNP-P-AB.webp'

const images = {
	Д: SnpD,
	Г: SnpG,
	В: SnpV,
	Б: SnpB,
	А: SnpA,
}

type Props = unknown

export const Size: FC<Props> = () => {
	const isReady = useAppSelector(state => state.snp.isReady)

	const snp = useAppSelector(getSnpType)
	const standard = useAppSelector(getStandard)

	// const dispatch = useAppDispatch()

	//TODO думаю это не работает
	if (!isReady) {
		return (
			<SizeContainer>
				<SizeSkeleton />
				<Column width={55}>
					<Skeleton animation='wave' />
					<Skeleton animation='wave' variant='rounded' width={'100%'} height={222} />
				</Column>
			</SizeContainer>
		)
	}

	return (
		<SizeContainer>
			<Column width={45}>{standard?.flangeStandard.code ? <Standard /> : <Another />}</Column>

			<Column width={55}>
				<Typography fontWeight='bold'>Чертеж прокладки</Typography>
				{!snp ? (
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
				)}
			</Column>
		</SizeContainer>
	)
}

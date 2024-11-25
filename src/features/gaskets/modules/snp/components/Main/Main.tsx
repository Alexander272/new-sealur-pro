import { FC } from 'react'
import { Skeleton, Typography } from '@mui/material'

import { useAppSelector } from '@/hooks/redux'
import { getFlangeType, getReady, getSnpType } from '@/features/gaskets/modules/snp/snpSlice'
import { MainSkeleton } from '@/features/gaskets/components/Skeletons/MainSkeleton'
import { MainContainer, Column, Image } from '@/features/gaskets/components/Skeletons/gasket.style'
import { Standards } from './Standards'
import { Flange } from './Flange'
import { Type } from './Type'

import FlangeA from '@/assets/snp/A.webp'
import FlangeB from '@/assets/snp/B.webp'
import FlangeV from '@/assets/snp/V.webp'
import FlangeG from '@/assets/snp/G.webp'
import FlangeD from '@/assets/snp/D.webp'

const images = {
	// А: FlangeA,
	// Б: FlangeB,
	// В: FlangeV,
	// 'В (STG)': FlangeV,
	// 'В (LTG)': FlangeV,
	А: FlangeA,
	'Б-А': FlangeB,
	'Б-Б': FlangeB,
	'Б-В': FlangeV,
	Г: FlangeG,
	Д: FlangeD,
}

type Props = unknown

// часть со стандартами, типами фланцев и типами снп
export const Main: FC<Props> = () => {
	const isReady = useAppSelector(getReady)

	const snp = useAppSelector(getSnpType)
	const flange = useAppSelector(getFlangeType)

	if (!isReady) {
		return (
			<MainContainer>
				<MainSkeleton />
				<Column>
					<Skeleton animation='wave' />
					<Skeleton animation='wave' variant='rounded' width={'100%'} height={222} />
				</Column>
			</MainContainer>
		)
	}

	return (
		<MainContainer>
			<Column>
				<Standards />
				<Flange />
				<Type />
			</Column>

			<Column>
				<Typography fontWeight='bold'>Чертеж фланца с прокладкой</Typography>
				{snp?.title == 'not_selected' ? (
					<Skeleton animation='wave' variant='rounded' width={'100%'} height={222} />
				) : (
					<Image
						src={images[`${flange == 'Б' ? flange + '-' : ''}${snp?.title}` as 'А']}
						alt='flange drawing'
						maxWidth={'450px'}
						width={450}
						height={239}
					/>
				)}
			</Column>
		</MainContainer>
	)
}

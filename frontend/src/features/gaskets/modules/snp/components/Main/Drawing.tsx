import { Skeleton, Typography } from '@mui/material'

import { Column, Image } from '@/features/gaskets/components/Skeletons/gasket.style'
import { useAppSelector } from '@/hooks/redux'
import { getFlangeType, getSnpType } from '../../snpSlice'

import FlangeA from '@/assets/snp/A.webp'
import FlangeB from '@/assets/snp/B.webp'
import FlangeV from '@/assets/snp/V.webp'
import FlangeG from '@/assets/snp/G.webp'
import FlangeD from '@/assets/snp/D.webp'

const images = {
	А: FlangeA,
	'Б-А': FlangeB,
	'Б-Б': FlangeB,
	'Б-В': FlangeV,
	Г: FlangeG,
	Д: FlangeD,
}

export const Drawing = () => {
	const snp = useAppSelector(getSnpType)
	const flange = useAppSelector(getFlangeType)

	return (
		<Column>
			<Typography fontWeight='bold'>Чертеж фланца с прокладкой</Typography>
			{!snp || snp?.title == 'not_selected' ? (
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
	)
}

import { FC } from 'react'
import { Skeleton, Typography } from '@mui/material'

import { useAppSelector } from '@/hooks/useStore'
import { Image } from '@/pages/Gasket/gasket.style'

import FlangeA from '@/assets/snp/A.webp'
import FlangeB from '@/assets/snp/B.webp'
import FlangeV from '@/assets/snp/V.webp'
import FlangeG from '@/assets/snp/G.webp'
import FlangeD from '@/assets/snp/D.webp'

const images = new Map([
	['В-А', FlangeA],
	['Б-А', FlangeB],
	['Б-Б', FlangeB],
	['Б-В', FlangeV],
	['А-Г', FlangeG],
	['А-Д', FlangeD],
])

export const Drawing: FC = () => {
	const snpType = useAppSelector(state => state.snp.main.snpType)
	const flangeTypeCode = useAppSelector(state => state.snp.main.flangeTypeCode)

	return (
		<>
			<Typography fontWeight='bold'>Чертеж фланца с прокладкой</Typography>
			{snpType?.title == 'not_selected' ? (
				<Skeleton animation='wave' variant='rounded' width={'100%'} height={222} />
			) : (
				<Image
					src={images.get(`${flangeTypeCode}-${snpType?.title}`)}
					alt='flange drawing'
					maxWidth={'450px'}
					width={450}
					height={239}
				/>
			)}
		</>
	)
}

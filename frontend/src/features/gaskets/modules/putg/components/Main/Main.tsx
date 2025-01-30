import { Skeleton, Typography } from '@mui/material'

import { useAppSelector } from '@/hooks/redux'
import { getFlangeType } from '@/features/gaskets/modules/putg/putgSlice'
import { Column, MainContainer, Image } from '@/features/gaskets/components/Skeletons/gasket.style'
import { Configuration } from './Configuration'
import { Standards } from './Standards'
import { Flange } from './Flange'
import { Gasket } from './Gasket'
import { Construction } from './Construction'

import FlangeA from '@/assets/putg/PUTG-A.webp'
import FlangeB from '@/assets/putg/PUTG-B.webp'
import FlangeV from '@/assets/putg/PUTG-C.webp'

const images = {
	А: FlangeA,
	Б: FlangeB,
	В: FlangeV,
}

export const Main = () => {
	const flangeType = useAppSelector(getFlangeType)

	return (
		<MainContainer>
			<Column>
				<Configuration />
				<Standards />
				<Flange />
				<Gasket />
				<Construction />
			</Column>

			<Column>
				<Typography fontWeight='bold'>Чертеж фланца с прокладкой</Typography>
				{!flangeType ? (
					<Skeleton animation='wave' variant='rounded' width={'100%'} height={222} />
				) : (
					<Image
						src={images[flangeType?.code as 'А']}
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

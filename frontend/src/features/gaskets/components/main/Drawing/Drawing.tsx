import { FC } from 'react'
import { Skeleton, Typography } from '@mui/material'

import { Column, Image } from '@/features/gaskets/components/Skeletons/gasket.style'

import FlangeA from '@/assets/putg/PUTG-A.webp'
import FlangeB from '@/assets/putg/PUTG-B.webp'
import FlangeV from '@/assets/putg/PUTG-C.webp'

const images = {
	'-': FlangeA,
	А: FlangeA,
	Б: FlangeB,
	В: FlangeV,
	'В (LTG)': FlangeV,
	'В (STG)': FlangeV,
}

type Props = {
	flange: string
}

export const BaseDrawing: FC<Props> = ({ flange }) => {
	return (
		<Column>
			<Typography fontWeight='bold'>Чертеж фланца с прокладкой</Typography>
			{!flange ? (
				<Skeleton animation='wave' variant='rounded' width={'100%'} height={222} />
			) : (
				<Image src={images[flange as 'А']} alt='flange drawing' maxWidth={'450px'} width={450} height={239} />
			)}
		</Column>
	)
}

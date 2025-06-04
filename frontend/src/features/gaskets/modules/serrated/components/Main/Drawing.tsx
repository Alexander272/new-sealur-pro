// import { Skeleton, Typography } from '@mui/material'

// import FlangeA from '@/assets/putg/PUTG-A.webp'
// import FlangeB from '@/assets/putg/PUTG-B.webp'
// import FlangeV from '@/assets/putg/PUTG-C.webp'

import { useAppSelector } from '@/hooks/redux'
// import { Column, Image } from '@/features/gaskets/components/Skeletons/gasket.style'
import { getFlangeType } from '../../serratedSlice'
import { BaseDrawing } from '@/features/gaskets/components/main/Drawing/Drawing'

export const Drawing = () => {
	const flange = useAppSelector(getFlangeType)

	return <BaseDrawing flange={flange?.code || '-'} />
	// return (
	// 	<Column>
	// 		<Typography fontWeight='bold'>Чертеж фланца с прокладкой</Typography>
	// 		{!flange ? (
	// 			<Skeleton animation='wave' variant='rounded' width={'100%'} height={222} />
	// 		) : (
	// 			<Image
	// 				src={images[flange?.code as 'А']}
	// 				alt='flange drawing'
	// 				maxWidth={'450px'}
	// 				width={450}
	// 				height={239}
	// 			/>
	// 		)}
	// 	</Column>
	// )
}

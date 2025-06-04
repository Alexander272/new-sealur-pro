// import { Skeleton, Typography } from '@mui/material'

import { useAppSelector } from '@/hooks/redux'
import { getFlangeType } from '@/features/gaskets/modules/putg/putgSlice'
import { BaseDrawing } from '@/features/gaskets/components/main/Drawing/Drawing'
// import { Column, Image } from '@/features/gaskets/components/Skeletons/gasket.style'

// import FlangeA from '@/assets/putg/PUTG-A.webp'
// import FlangeB from '@/assets/putg/PUTG-B.webp'
// import FlangeV from '@/assets/putg/PUTG-C.webp'

// const images = {
// 	А: FlangeA,
// 	Б: FlangeB,
// 	В: FlangeV,
// }

export const Drawing = () => {
	const flange = useAppSelector(getFlangeType)

	return <BaseDrawing flange={flange?.code || '-'} />
	// return (
	// 	<Column>
	// 		<Typography fontWeight='bold'>Чертеж фланца с прокладкой</Typography>
	// 		{!flangeType ? (
	// 			<Skeleton animation='wave' variant='rounded' width={'100%'} height={222} />
	// 		) : (
	// 			<Image
	// 				src={images[flangeType?.code as 'А']}
	// 				alt='flange drawing'
	// 				maxWidth={'450px'}
	// 				width={450}
	// 				height={239}
	// 			/>
	// 		)}
	// 	</Column>
	// )
}

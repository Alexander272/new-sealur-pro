import { Skeleton } from '@mui/material'
import { Column } from './gasket.style'

export const MainSkeleton = () => {
	return (
		<Column>
			<Skeleton animation='wave' />
			<Skeleton animation='wave' variant='rounded' height={40} />

			<Skeleton animation='wave' />
			<Skeleton animation='wave' variant='rounded' height={40} />

			<Skeleton animation='wave' />
			<Skeleton animation='wave' variant='rounded' height={40} />
		</Column>

		// <MainContainer>

		// 	<Column>
		// 		<Skeleton animation='wave' />
		// 		<Skeleton animation='wave' variant='rounded' width={'100%'} height={222} />
		// 	</Column>
		// </MainContainer>
	)
}

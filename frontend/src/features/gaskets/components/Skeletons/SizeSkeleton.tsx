import { Skeleton } from '@mui/material'
import { Column } from './gasket.style'

export const SizeSkeleton = () => {
	return (
		<Column>
			<Skeleton animation='wave' />
			<Skeleton animation='wave' variant='rounded' height={40} />

			<Skeleton animation='wave' />
			<Skeleton animation='wave' variant='rounded' height={40} />

			<Skeleton animation='wave' />
			<Skeleton animation='wave' variant='rounded' height={40} />
		</Column>
	)
}

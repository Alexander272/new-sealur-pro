import { Skeleton } from '@mui/material'

export const MaterialSkeleton = () => {
	return (
		<>
			<Skeleton animation='wave' />
			<Skeleton animation='wave' variant='rounded' height={40} />

			<Skeleton animation='wave' sx={{ marginTop: 1 }} />
			<Skeleton animation='wave' variant='rounded' height={40} />

			<Skeleton animation='wave' sx={{ marginTop: 1 }} />
			<Skeleton animation='wave' variant='rounded' height={40} />

			<Skeleton animation='wave' sx={{ marginTop: 1 }} />
			<Skeleton animation='wave' variant='rounded' height={40} />
		</>
	)
}

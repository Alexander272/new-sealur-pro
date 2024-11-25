import { Skeleton } from '@mui/material'

export const DesignSkeleton = () => {
	return (
		<>
			<Skeleton animation='wave' />
			<Skeleton animation='wave' variant='rounded' height={36} sx={{ maxWidth: '330px', marginTop: 1 }} />
			<Skeleton animation='wave' variant='rounded' height={36} sx={{ maxWidth: '330px', marginTop: 1 }} />
			<Skeleton
				animation='wave'
				variant='rounded'
				height={36}
				sx={{ maxWidth: '330px', marginTop: 1, marginBottom: 3 }}
			/>

			<Skeleton animation='wave' variant='rounded' height={40} sx={{ maxWidth: '300px' }} />
		</>
	)
}

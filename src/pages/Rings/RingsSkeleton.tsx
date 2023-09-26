import { Skeleton, Stack } from '@mui/material'
import { PageTitle } from './rings.style'

export const RingsSkeleton = () => {
	return (
		<>
			<PageTitle>
				<Skeleton animation='wave' sx={{ width: '30%', margin: 'auto' }} />
			</PageTitle>

			<Stack
				direction={'row'}
				mt={5}
				// mb={4}
				mb={2}
				alignItems={'center'}
				justifyContent={'center'}
			>
				<Skeleton animation='wave' height={'40px'} sx={{ width: '50%', margin: 'auto' }} />
			</Stack>

			<Stack direction={'row'} spacing={2} width={'100%'} maxWidth={1200} ml={'auto'} mr={'auto'}>
				<Stack width={'65%'}>
					<Skeleton animation='wave' variant='rounded' width={'100%'} height={144} />
				</Stack>

				<Stack width={'35%'}>
					<Skeleton animation='wave' variant='rounded' width={'100%'} height={144} />
				</Stack>
			</Stack>
		</>
	)
}

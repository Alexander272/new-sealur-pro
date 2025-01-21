import { Skeleton, Box, Stack } from '@mui/material'
import { ResultContainer } from './gasket.style'

export const ResultSkeleton = () => {
	return (
		<ResultContainer>
			<Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 0, sm: 2 }} marginBottom={2}>
				<Box width={'100%'} marginRight={2} sx={{ maxWidth: '72px' }}>
					<Skeleton animation='wave' />
				</Box>

				<Box width={'100%'}>
					<Skeleton animation='wave' />
					<Skeleton animation='wave' />
					<Skeleton animation='wave' />
				</Box>
			</Stack>

			<Stack
				direction={{ xs: 'column', sm: 'row' }}
				spacing={{ xs: 0, sm: 2 }}
				alignItems={{ xs: 'flex-start', sm: 'center' }}
				marginBottom={2}
			>
				<Box width={'100%'} sx={{ maxWidth: '106px' }}>
					<Skeleton animation='wave' />
				</Box>
				<Box width={'100%'} sx={{ maxWidth: '500px' }}>
					<Skeleton animation='wave' sx={{ fontSize: '1.5rem' }} />
				</Box>
			</Stack>

			<Stack
				direction={{ xs: 'column', md: 'row' }}
				spacing={2}
				alignItems={{ xs: 'flex-start', md: 'center' }}
				justifyContent='space-between'
			>
				<Stack direction={'row'} spacing={2} alignItems='center' width={'100%'}>
					<Box width={'100%'} sx={{ maxWidth: '106px' }}>
						<Skeleton animation='wave' />
					</Box>
					<Box width={'100%'} height={40} sx={{ maxWidth: '232px' }}>
						<Skeleton animation='wave' variant='rounded' height={'100%'} width={'100%'} />
					</Box>
				</Stack>

				<Skeleton animation='wave' variant='rounded' height={40} sx={{ width: '100%', maxWidth: '200px' }} />
			</Stack>
		</ResultContainer>
	)
}

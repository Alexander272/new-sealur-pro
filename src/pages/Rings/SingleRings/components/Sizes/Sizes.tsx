import { Box } from '@mui/material'

export const Sizes = () => {
	return (
		<Box
			padding={'6px 8px'}
			ml={'4px'}
			mr={'4px'}
			// border={'1px solid var(--primary-color)'}
			borderRadius={'12px'}
			sx={{
				cursor: 'pointer',
				transition: 'all .3s ease-in-out',
				':hover': { backgroundColor: '#0000000a' },
			}}
		>
			00×00×0
		</Box>
	)
}

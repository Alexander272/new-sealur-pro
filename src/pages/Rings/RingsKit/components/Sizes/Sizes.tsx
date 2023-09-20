import { Box, Typography } from '@mui/material'

export const Sizes = () => {
	return (
		<Box
			// onClick={toggleHandler}
			// ref={anchor}
			padding={'6px 8px'}
			ml={'4px'}
			mr={'4px'}
			borderRadius={'12px'}
			// color={!step.required ? '#999' : '#000'}
			sx={{
				cursor: 'pointer',
				transition: 'all .3s ease-in-out',
				// backgroundColor: step.error ? '#ff2d2d73' : 'transparent',
				':hover': { backgroundColor: '#0000000a' },
			}}
		>
			<Typography fontSize={'inherit'}>00×00×0</Typography>
		</Box>
	)
}

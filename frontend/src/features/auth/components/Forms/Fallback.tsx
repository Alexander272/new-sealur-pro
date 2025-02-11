import { Stack } from '@mui/material'

import { Fallback as Orig } from '@/components/Fallback/Fallback'

export const Fallback = () => {
	return (
		<Stack
			justifyContent={'center'}
			alignItems={'center'}
			position={'absolute'}
			top={0}
			left={0}
			width={'100%'}
			height={'100%'}
			zIndex={100}
			sx={{ background: '#d8e0fc24' }}
		>
			<Orig height={160} width={160} borderRadius={3} zIndex={15} backgroundColor={'#ffffff'} />
		</Stack>
	)
}

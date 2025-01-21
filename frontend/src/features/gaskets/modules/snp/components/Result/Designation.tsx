import { Stack, Typography } from '@mui/material'

import { useDesignation } from '../../hooks/designation'

export const Designation = () => {
	const designation = useDesignation()
	console.log('designation', designation)

	return (
		<Stack
			direction={{ xs: 'column', sm: 'row' }}
			spacing={{ xs: 0, sm: 2 }}
			alignItems={{ xs: 'flex-start', sm: 'center' }}
			marginBottom={2}
		>
			<Typography fontWeight='bold'>Обозначение:</Typography>
			<Typography fontSize={'1.12rem'}>{designation}</Typography>
		</Stack>
	)
}

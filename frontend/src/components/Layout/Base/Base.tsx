import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'

import { Fallback } from '@/components/Fallback/Fallback'

export const Base = () => {
	return (
		<Box minHeight={'100vh'} display='flex' flexDirection='column' sx={{ backgroundColor: 'var(--body-bg-color)' }}>
			<Suspense fallback={<Fallback flexGrow={1} />}>
				<Outlet />
			</Suspense>
		</Box>
	)
}

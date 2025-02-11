import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Box } from '@mui/material'

import { Fallback } from '@/components/Fallback/Fallback'

export const Base = () => {
	const location = useLocation()

	return (
		<Box minHeight={'100vh'} display='flex' flexDirection='column' sx={{ backgroundColor: 'var(--body-bg-color)' }}>
			<Suspense key={location.key} fallback={<Fallback flexGrow={1} />}>
				<Outlet />
			</Suspense>
		</Box>
	)
}

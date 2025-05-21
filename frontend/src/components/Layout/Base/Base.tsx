import { Suspense } from 'react'
import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { MetrikaCounter } from 'react-metrika'

import { MetricId } from '@/constants/metric'
import { Fallback } from '@/components/Fallback/Fallback'

export const Base = () => {
	return (
		<Box minHeight={'100vh'} display='flex' flexDirection='column' sx={{ backgroundColor: 'var(--body-bg-color)' }}>
			<Suspense fallback={<Fallback flexGrow={1} />}>
				<Outlet />
			</Suspense>

			{process.env.NODE_ENV !== 'development' ? (
				<MetrikaCounter
					id={MetricId}
					options={{
						trackHash: true,
						clickmap: true,
						accurateTrackBounce: true,
					}}
				/>
			) : null}
		</Box>
	)
}

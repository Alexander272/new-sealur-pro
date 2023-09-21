import { Skeleton } from '@mui/material'
import { Content, PageTitle } from './rings.style'

export const RingsSkeleton = () => {
	return (
		<>
			<PageTitle>
				<Skeleton animation='wave' sx={{ width: '40%', margin: 'auto' }} />
			</PageTitle>

			<Content></Content>
		</>
	)
}

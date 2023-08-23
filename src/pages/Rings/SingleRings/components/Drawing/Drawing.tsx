import { useAppSelector } from '@/hooks/useStore'
import { Typography } from '@mui/material'

export const Drawing = () => {
	const drawing = useAppSelector(state => state.ring.drawing)

	if (!drawing) return null
	return (
		<Typography mr={1} fontSize={'inherit'}>
			(черт.)
		</Typography>
	)
}

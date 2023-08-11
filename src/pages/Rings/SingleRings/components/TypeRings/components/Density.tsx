import { FC, MouseEvent } from 'react'
import { List, ListItemButton, ListSubheader } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import type { IRingDensity } from '@/types/rings'
import { setDensity } from '@/store/rings/ring'

type Props = {
	densityData: IRingDensity[]
}

export const Density: FC<Props> = ({ densityData }) => {
	const density = useAppSelector(state => state.ring.density)

	const dispatch = useAppDispatch()

	const selectDensity = (event: MouseEvent<HTMLDivElement>) => {
		const { index } = (event.target as HTMLDivElement).dataset
		if (!index) return

		dispatch(setDensity(densityData[+index]))
	}

	return (
		<>
			<List sx={{ maxWidth: '200px', maxHeight: '450px', overflow: 'auto' }}>
				<ListSubheader sx={{ color: '#000', fontSize: '1rem', fontWeight: 'bold' }}>Плотность</ListSubheader>
				{densityData.map((r, i) => (
					<ListItemButton
						key={r.id}
						selected={density?.id == r.id}
						onClick={selectDensity}
						data-index={i}
						sx={{ borderRadius: '12px' }}
					>
						{r.code} - {r.title}
					</ListItemButton>
				))}
			</List>
		</>
	)
}

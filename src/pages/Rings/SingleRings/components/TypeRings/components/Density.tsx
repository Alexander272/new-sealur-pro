import { FC, MouseEvent } from 'react'
import { Divider, List, ListItemButton, ListSubheader } from '@mui/material'
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
			<List sx={{ maxWidth: '250px', maxHeight: '450px', overflow: 'auto', paddingTop: 0 }}>
				<ListSubheader
					sx={{
						color: '#000',
						fontSize: '1rem',
						fontWeight: 'bold',
						lineHeight: '24px',
						marginTop: 1,
						marginBottom: 1,
					}}
				>
					Плотность
				</ListSubheader>
				<Divider sx={{ marginBottom: 1, marginRight: 1, marginLeft: 1 }} />

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

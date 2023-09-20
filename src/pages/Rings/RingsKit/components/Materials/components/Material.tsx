import { FC, MouseEvent, useRef, useState } from 'react'
import type { IRingMaterial } from '@/types/rings'
import { useAppDispatch } from '@/hooks/useStore'
import { Divider, List, ListItemButton, ListSubheader } from '@mui/material'
import { RingTooltip } from '@/pages/Rings/components/RingTooltip/RingTooltip'

type Props = {
	materials: IRingMaterial[]
	material: string
	position: 'first' | 'second'
	onSelect: (title: string, position: 'first' | 'second') => void
}

export const Material: FC<Props> = ({ materials, material, position, onSelect }) => {
	const anchor = useRef<HTMLDivElement | null>(null)
	const [open, setOpen] = useState(false)

	const [selected, setSelected] = useState<IRingMaterial | null>(null)

	const dispatch = useAppDispatch()

	const openHandler = () => setOpen(true)
	const closeHandler = () => setOpen(false)

	const hoverHandler = (event: MouseEvent<HTMLDivElement>) => {
		const { index } = (event.target as HTMLDivElement).dataset
		if (!index) return

		anchor.current = event.target as HTMLDivElement
		setSelected(materials[+index] || null)

		openHandler()
	}
	const leaveHandler = () => {
		closeHandler()
	}

	const selectMaterial = (event: MouseEvent<HTMLDivElement>) => {
		const { index } = (event.target as HTMLDivElement).dataset
		if (!index) return

		onSelect(materials[+index].title, position)

		// dispatch(setMaterial(materials[+index].title))
		// dispatch(setStep({ step: 'materialStep', active: false, complete: true }))
	}

	return (
		<>
			<List
				sx={{
					minWidth: 250,
					maxWidth: 370,
					maxHeight: '450px',
					overflow: 'auto',
					paddingTop: 0,
				}}
			>
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
					Материал
				</ListSubheader>
				<Divider sx={{ marginBottom: 1, marginRight: 1, marginLeft: 1 }} />

				{materials.map((r, i) => (
					<ListItemButton
						key={r.id}
						selected={material == r.title}
						onClick={selectMaterial}
						onMouseEnter={hoverHandler}
						onMouseLeave={leaveHandler}
						data-index={i}
						sx={{ borderRadius: '12px' }}
					>
						{r.title} {r.description && r.type != 'padding' ? `(${r.description})` : ''}
					</ListItemButton>
				))}
			</List>

			{selected && selected.type == 'padding' && selected.description ? (
				<RingTooltip open={open} anchor={anchor.current} description={selected?.description} />
			) : null}
		</>
	)
}

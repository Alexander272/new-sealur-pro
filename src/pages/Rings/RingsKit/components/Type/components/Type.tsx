import { FC, MouseEvent, useRef, useState } from 'react'
import { Divider, List, ListItemButton, ListSubheader } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import type { IKitType } from '@/types/ringsKit'
import { setKitType } from '@/store/rings/kit'
import { RingTooltip } from '@/pages/Rings/components/RingTooltip/RingTooltip'

type Props = {
	types: IKitType[]
}

export const Type: FC<Props> = ({ types }) => {
	const anchor = useRef<HTMLDivElement | null>(null)
	const [open, setOpen] = useState(false)

	const [selected, setSelected] = useState<IKitType | null>(null)

	const typeId = useAppSelector(state => state.kit.typeId)

	const dispatch = useAppDispatch()

	const openHandler = () => setOpen(true)
	const closeHandler = () => setOpen(false)

	const hoverHandler = (event: MouseEvent<HTMLDivElement>) => {
		const { index } = (event.target as HTMLDivElement).dataset
		if (!index) return

		anchor.current = event.target as HTMLDivElement
		setSelected(types[+index])

		openHandler()
	}
	const leaveHandler = () => {
		// setSelected(null)
		closeHandler()
	}

	const selectRingType = (event: MouseEvent<HTMLDivElement>) => {
		const { index } = (event.target as HTMLDivElement).dataset
		if (!index) return
		if (typeId == types[+index].id) return

		dispatch(setKitType(types[+index]))
	}

	return (
		<>
			<List sx={{ maxWidth: '230px', maxHeight: '450px', overflow: 'auto', paddingTop: 0 }}>
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
					Исполнение
				</ListSubheader>
				<Divider sx={{ marginBottom: 1, marginRight: 1, marginLeft: 1 }} />

				{types.map((r, i) => (
					<ListItemButton
						key={r.id}
						selected={typeId == r.id}
						onClick={selectRingType}
						onMouseEnter={hoverHandler}
						onMouseLeave={leaveHandler}
						data-index={i}
						sx={{ borderRadius: '12px' }}
					>
						{r.code}
					</ListItemButton>
				))}
			</List>

			{selected && (
				<RingTooltip
					open={open}
					anchor={anchor.current}
					image={selected?.image}
					description={selected?.title}
				/>
			)}
		</>
	)
}

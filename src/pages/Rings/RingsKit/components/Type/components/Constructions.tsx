import { FC, MouseEvent, useRef, useState } from 'react'
import { Divider, List, ListItemButton, ListSubheader } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { RingTooltip } from '@/pages/Rings/components/RingTooltip/RingTooltip'
import { IKitConstructions } from '@/types/ringsKit'
import { setConstruction } from '@/store/rings/kit'

type Props = {
	constructions: IKitConstructions[]
}

export const Constructions: FC<Props> = ({ constructions }) => {
	const anchor = useRef<HTMLDivElement | null>(null)
	const [open, setOpen] = useState(false)

	const [selected, setSelected] = useState<IKitConstructions | null>(null)

	const construction = useAppSelector(state => state.kit.construction)

	const dispatch = useAppDispatch()

	const openHandler = () => setOpen(true)
	const closeHandler = () => setOpen(false)

	const hoverHandler = (event: MouseEvent<HTMLDivElement>) => {
		const { index } = (event.target as HTMLDivElement).dataset
		if (!index) return

		anchor.current = event.target as HTMLDivElement
		setSelected(constructions[+index])

		openHandler()
	}
	const leaveHandler = () => {
		// setSelected(null)
		closeHandler()
	}

	const selectConstruction = (event: MouseEvent<HTMLDivElement>) => {
		const { index } = (event.target as HTMLDivElement).dataset
		if (!index) return

		dispatch(setConstruction(constructions[+index]))
	}

	return (
		<>
			<List sx={{ maxWidth: '200px', maxHeight: '450px', overflow: 'auto', paddingTop: 0 }}>
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
					Конструкция
				</ListSubheader>
				<Divider sx={{ marginBottom: 1, marginRight: 1, marginLeft: 1 }} />

				{constructions.map((r, i) => (
					<ListItemButton
						key={r.id}
						selected={construction?.code == r.code}
						onClick={selectConstruction}
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
					imageMaxWidth={150}
					hasIndent
				/>
			)}
		</>
	)
}

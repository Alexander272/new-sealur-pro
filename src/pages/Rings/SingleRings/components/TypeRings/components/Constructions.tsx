import { FC, MouseEvent, useRef, useState } from 'react'
import { Box, List, ListItemButton, ListSubheader, Popover, Stack, Typography } from '@mui/material'
import type { IRingConstruction } from '@/types/rings'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { setConstruction } from '@/store/rings/ring'
import { Image } from '@/pages/Gasket/gasket.style'

type Props = {
	constructionsData: IRingConstruction[]
}

export const Constructions: FC<Props> = ({ constructionsData }) => {
	const anchor = useRef<HTMLDivElement | null>(null)
	const [open, setOpen] = useState(false)

	const [selected, setSelected] = useState<IRingConstruction | null>(null)

	const construction = useAppSelector(state => state.ring.construction)
	const density = useAppSelector(state => state.ring.density)

	const dispatch = useAppDispatch()

	const openHandler = () => setOpen(true)
	const closeHandler = () => setOpen(false)

	const hoverHandler = (event: MouseEvent<HTMLDivElement>) => {
		const { index } = (event.target as HTMLDivElement).dataset
		if (!index) return

		anchor.current = event.target as HTMLDivElement
		setSelected(constructionsData[+index])

		openHandler()
	}
	const leaveHandler = () => {
		// setSelected(null)
		closeHandler()
	}

	const selectConstruction = (event: MouseEvent<HTMLDivElement>) => {
		const { index } = (event.target as HTMLDivElement).dataset
		if (!index) return

		dispatch(setConstruction(constructionsData[+index].code))
	}

	return (
		<>
			<List sx={{ maxWidth: '200px', maxHeight: '450px', overflow: 'auto', paddingTop: 0 }}>
				<ListSubheader sx={{ color: '#000', fontSize: '1rem', fontWeight: 'bold' }}>Конструкция</ListSubheader>
				{constructionsData.map((r, i) => (
					<ListItemButton
						key={r.id}
						selected={construction == r.code}
						onClick={selectConstruction}
						onMouseEnter={hoverHandler}
						onMouseLeave={leaveHandler}
						data-index={i}
						sx={{ borderRadius: '12px' }}
						disabled={!density?.hasRotaryPlug && !r.withoutRotaryPlug}
					>
						{r.code}
					</ListItemButton>
				))}
			</List>

			<Popover
				open={open}
				anchorEl={anchor.current}
				anchorOrigin={{
					vertical: 'center',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'center',
					horizontal: 'left',
				}}
				slotProps={{
					paper: {
						elevation: 0,
						sx: {
							overflow: 'visible',
							filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
							'&:before': {
								content: '""',
								display: 'block',
								position: 'absolute',
								top: '50%',
								left: 0,
								width: 10,
								height: 10,
								bgcolor: 'background.paper',
								transform: 'translate(-50%, -50%) rotate(45deg)',
								zIndex: 0,
							},
						},
					},
				}}
				onClose={closeHandler}
				disableRestoreFocus
				sx={{ pointerEvents: 'none' }}
			>
				<Stack direction={'row'} spacing={2} margin={2} maxWidth={450} alignItems={'center'}>
					<Box display={'flex'} maxWidth={80}>
						<Image src={selected?.image} alt={selected?.code} />
					</Box>
					<Typography align='justify'>{selected?.title}</Typography>
				</Stack>
			</Popover>
		</>
	)
}

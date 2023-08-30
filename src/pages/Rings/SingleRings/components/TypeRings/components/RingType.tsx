import { FC, MouseEvent, useRef, useState } from 'react'
import { Box, Divider, List, ListItemButton, ListSubheader, Popover, Stack, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import type { IRingType } from '@/types/rings'
import { Image } from '@/pages/Gasket/gasket.style'
import { setRingType } from '@/store/rings/ring'

type Props = {
	ringData: IRingType[]
}

export const RingType: FC<Props> = ({ ringData }) => {
	const anchor = useRef<HTMLDivElement | null>(null)
	const [open, setOpen] = useState(false)

	const [selected, setSelected] = useState<IRingType | null>(null)

	const ringType = useAppSelector(state => state.ring.ringType)

	const dispatch = useAppDispatch()

	const openHandler = () => setOpen(true)
	const closeHandler = () => setOpen(false)

	const hoverHandler = (event: MouseEvent<HTMLDivElement>) => {
		const { index } = (event.target as HTMLDivElement).dataset
		if (!index) return

		anchor.current = event.target as HTMLDivElement
		setSelected(ringData[+index])

		openHandler()
	}
	const leaveHandler = () => {
		// setSelected(null)
		closeHandler()
	}

	const selectRingType = (event: MouseEvent<HTMLDivElement>) => {
		const { index } = (event.target as HTMLDivElement).dataset
		if (!index) return
		if (ringType?.id == ringData[+index].id) return

		dispatch(setRingType(ringData[+index]))
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

				{ringData.map((r, i) => (
					<ListItemButton
						key={r.id}
						selected={ringType?.id == r.id}
						onClick={selectRingType}
						onMouseEnter={hoverHandler}
						onMouseLeave={leaveHandler}
						data-index={i}
						sx={{ borderRadius: '12px' }}
					>
						{r.code} - {r.title}
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
				<Stack direction={'row'} spacing={2} margin={2} maxWidth={500} alignItems={'center'}>
					<Box display={'flex'} maxWidth={100} width={'100%'}>
						<Image src={selected?.image} alt={selected?.code} />
					</Box>
					<Typography align='justify'>{selected?.description}</Typography>
				</Stack>
			</Popover>
		</>
	)
}

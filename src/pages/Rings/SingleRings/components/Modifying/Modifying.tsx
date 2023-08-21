import { MouseEvent, useRef, useState } from 'react'
import { List, ListItemButton, ListSubheader, Popover, Stack, Typography } from '@mui/material'
import { useGetModifyingQuery } from '@/store/api/rings'
import { setModifying, setStep } from '@/store/rings/ring'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import type { IRingModifying } from '@/types/rings'
import { Step } from '../Step/Step'

export const Modifying = () => {
	const anchor = useRef<HTMLDivElement | null>(null)
	const [open, setOpen] = useState(false)

	const [selected, setSelected] = useState<IRingModifying | null>(null)

	const modifying = useAppSelector(state => state.ring.modifying)

	const dispatch = useAppDispatch()

	const { data } = useGetModifyingQuery(null)

	const openHandler = () => setOpen(true)
	const closeHandler = () => setOpen(false)

	const hoverHandler = (event: MouseEvent<HTMLDivElement>) => {
		const { index } = (event.target as HTMLDivElement).dataset
		if (!index) return

		anchor.current = event.target as HTMLDivElement
		setSelected(data?.data.modifying[+index] || null)

		openHandler()
	}
	const leaveHandler = () => {
		closeHandler()
	}

	const selectMaterial = (event: MouseEvent<HTMLDivElement>) => {
		const { index } = (event.target as HTMLDivElement).dataset
		if (!index || !data) return

		if (index == '-1') dispatch(setModifying(null))
		else dispatch(setModifying(data.data.modifying[+index].code))

		dispatch(setStep({ step: 'modifyingStep', active: false, complete: index != '-1' }))
	}

	return (
		<Step label={modifying || 'Х'} stepName='modifyingStep'>
			<List sx={{ width: 200, marginRight: 2, marginLeft: 2, paddingTop: 0 }}>
				<ListSubheader
					sx={{
						color: '#000',
						fontSize: '1rem',
						fontWeight: 'bold',
						lineHeight: '24px',
						marginTop: 1.5,
						marginBottom: 1.5,
					}}
				>
					Модифицирующие добавки
				</ListSubheader>

				<ListItemButton
					selected={modifying == null}
					onClick={selectMaterial}
					data-index={-1}
					sx={{ borderRadius: '12px' }}
				>
					Без добавок
				</ListItemButton>

				{data?.data.modifying.map((r, i) => (
					<ListItemButton
						key={r.id}
						selected={modifying == r.code}
						onClick={selectMaterial}
						onMouseEnter={hoverHandler}
						onMouseLeave={leaveHandler}
						data-index={i}
						sx={{ borderRadius: '12px' }}
					>
						{r.title}
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
					<Typography align='justify'>{selected?.description}</Typography>
				</Stack>
			</Popover>
		</Step>
	)
}

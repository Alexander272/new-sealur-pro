import { FC, PropsWithChildren, useRef } from 'react'
import { Box, Menu, Typography } from '@mui/material'
import type { Steps } from '@/types/rings'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { toggleActiveStep } from '@/store/rings/ring'

type Props = {
	label: string
	stepName: Steps
}

export const Step: FC<PropsWithChildren<Props>> = ({ children, label, stepName }) => {
	const anchor = useRef<HTMLDivElement | null>(null)

	const step = useAppSelector(state => state.ring[stepName])

	const dispatch = useAppDispatch()

	const toggleHandler = () => dispatch(toggleActiveStep(stepName))

	return (
		<>
			<Box
				onClick={toggleHandler}
				ref={anchor}
				padding={'6px 8px'}
				ml={'4px'}
				mr={'4px'}
				borderRadius={'12px'}
				color={!step.required ? '#999' : '#000'}
				sx={{
					cursor: 'pointer',
					transition: 'all .3s ease-in-out',
					backgroundColor: step.error ? '#ff2d2d73' : 'transparent',
					':hover': { backgroundColor: '#0000000a' },
				}}
			>
				<Typography fontWeight={step.active || step.complete ? 'bold' : 'normal'} fontSize={'inherit'}>
					{label}
				</Typography>
			</Box>

			<Menu
				open={anchor.current != null && step.active}
				onClose={toggleHandler}
				anchorEl={anchor.current}
				transformOrigin={{ horizontal: 'center', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
				MenuListProps={{
					role: 'listbox',
					disableListWrap: true,
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
								top: 0,
								left: '50%',
								width: 10,
								height: 10,
								bgcolor: 'background.paper',
								transform: 'translate(-50%, -50%) rotate(45deg)',
								zIndex: 0,
							},
						},
					},
				}}
			>
				{children}
			</Menu>
		</>
	)
}

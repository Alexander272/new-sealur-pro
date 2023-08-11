import { useEffect, useRef } from 'react'
import { Box, Divider, Menu, Stack, Typography } from '@mui/material'
import { useGetRingQuery } from '@/store/api/rings'
import { toggleActiveStep, setTypeStep, setStep } from '@/store/rings/ring'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { Constructions } from './components/Constructions'
import { Density } from './components/Density'
import { RingType } from './components/RingType'
import { Step } from '../Step/Step'

export const TypeRings = () => {
	const anchor = useRef<HTMLDivElement | null>(null)

	const ringType = useAppSelector(state => state.ring.ringType)
	const construction = useAppSelector(state => state.ring.construction)
	const density = useAppSelector(state => state.ring.density)

	const typeStep = useAppSelector(state => state.ring.typeStep)

	const dispatch = useAppDispatch()

	const { data } = useGetRingQuery(null)

	useEffect(() => {
		let ok = Boolean(ringType)
		ok = ok && Boolean((ringType?.hasDensity && density) || !ringType?.hasDensity)
		ok = ok && Boolean((ringType?.hasRotaryPlug && construction) || !ringType?.hasRotaryPlug)

		if (ok) {
			dispatch(setStep({ step: 'typeStep', active: false, complete: true }))
		}
	}, [ringType, construction, density])

	const toggleHandler = () => dispatch(toggleActiveStep('typeStep'))

	return (
		<Step
			label={
				(ringType?.hasRotaryPlug ? (construction || '00') + '-' : '') +
				(ringType?.code || 'Х') +
				(ringType?.hasDensity ? '-' + (density || 'Х') : '')
			}
			stepName='typeStep'
		>
			<Stack
				direction={'row'}
				divider={<Divider orientation='vertical' flexItem />}
				spacing={1}
				mr={2}
				ml={2}
				overflow={'hidden'}
			>
				{ringType?.hasRotaryPlug && (
					<Constructions
						constructionsData={data?.data.constructions.constructions[ringType.id].constructions || []}
					/>
				)}
				<RingType ringData={data?.data.ringTypes || []} />
				{ringType?.hasDensity && (
					<Density densityData={data?.data.density.density[ringType.id].density || []} />
				)}
			</Stack>
		</Step>
		// <>
		// 	<Box
		// 		onClick={toggleHandler}
		// 		ref={anchor}
		// 		padding={'6px 8px'}
		// 		ml={'4px'}
		// 		mr={'4px'}
		// 		// border={'1px solid var(--primary-color)'}
		// 		borderRadius={'12px'}
		// 		// fontWeight={typeStep.active || typeStep.complete ? 'bold' : 'normal'}
		// 		color={!typeStep.required ? '#999' : '#000'}
		// 		sx={{
		// 			cursor: 'pointer',
		// 			transition: 'all .3s ease-in-out',
		// 			backgroundColor: typeStep.error ? '#ff2d2d73' : 'transparent',
		// 			':hover': { backgroundColor: '#0000000a' },
		// 		}}
		// 	>
		// 		<Typography fontWeight={typeStep.active || typeStep.complete ? 'bold' : 'normal'}>
		// 			{ringType?.hasRotaryPlug ? (construction || '00') + '-' : ''}
		// 			{ringType?.code || 'Х'}
		// 			{ringType?.hasDensity ? '-' + (density || 'Х') : ''}
		// 		</Typography>
		// 	</Box>

		// 	<Menu
		// 		id={'type-ring-menu'}
		// 		open={anchor.current != null && typeStep.active}
		// 		onClose={toggleHandler}
		// 		// onClick={selectHandler}
		// 		anchorEl={anchor.current}
		// 		transformOrigin={{ horizontal: 'center', vertical: 'top' }}
		// 		anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
		// 		MenuListProps={{
		// 			role: 'listbox',
		// 			disableListWrap: true,
		// 			// style: { maxHeight: '70vh' },
		// 		}}
		// 		slotProps={{
		// 			paper: {
		// 				elevation: 0,
		// 				sx: {
		// 					overflow: 'visible',
		// 					filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
		// 					// mt: 1.5,
		// 					'&:before': {
		// 						content: '""',
		// 						display: 'block',
		// 						position: 'absolute',
		// 						top: 0,
		// 						left: '50%',
		// 						width: 10,
		// 						height: 10,
		// 						bgcolor: 'background.paper',
		// 						transform: 'translate(-50%, -50%) rotate(45deg)',
		// 						zIndex: 0,
		// 					},
		// 				},
		// 			},
		// 		}}
		// 	>
		// 		<Stack
		// 			direction={'row'}
		// 			divider={<Divider orientation='vertical' flexItem />}
		// 			spacing={1}
		// 			mr={2}
		// 			ml={2}
		// 			overflow={'hidden'}
		// 		>
		// 			{ringType?.hasRotaryPlug && (
		// 				<Constructions
		// 					constructionsData={data?.data.constructions.constructions[ringType.id].constructions || []}
		// 				/>
		// 			)}
		// 			<RingType ringData={data?.data.ringTypes || []} />
		// 			{ringType?.hasDensity && (
		// 				<Density densityData={data?.data.density.density[ringType.id].density || []} />
		// 			)}
		// 		</Stack>
		// 	</Menu>
		// </>
	)
}

import { useEffect } from 'react'
import { Divider, Stack } from '@mui/material'
import { useGetRingSingleQuery } from '@/store/api/rings'
import { setStep, toggleActiveStep } from '@/store/rings/ring'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { Constructions } from './components/Constructions'
import { Density } from './components/Density'
import { RingType } from './components/RingType'
import { Step } from '../../../components/Step/Step'

export const TypeRings = () => {
	const ringType = useAppSelector(state => state.ring.ringType)
	const construction = useAppSelector(state => state.ring.construction)
	const density = useAppSelector(state => state.ring.density)

	const step = useAppSelector(state => state.ring.typeStep)

	const dispatch = useAppDispatch()

	const { data } = useGetRingSingleQuery(null)

	useEffect(() => {
		let ok = Boolean(ringType?.id)
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
				(ringType?.hasRotaryPlug ? (construction?.code || 'ХХ') + '-' : '') +
				(ringType?.code || 'Х') +
				(ringType?.hasDensity ? '-' + (density?.code || 'Х') : '')
			}
			step={step}
			toggle={toggleHandler}
		>
			<Stack direction={'row'} divider={<Divider orientation='vertical' flexItem />} spacing={1} mr={2} ml={2}>
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
	)
}

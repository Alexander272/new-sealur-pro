import { useEffect } from 'react'
import { Divider, Stack } from '@mui/material'
import { useGetRingQuery } from '@/store/api/rings'
import { setStep } from '@/store/rings/ring'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { Constructions } from './components/Constructions'
import { Density } from './components/Density'
import { RingType } from './components/RingType'
import { Step } from '../Step/Step'

export const TypeRings = () => {
	const ringType = useAppSelector(state => state.ring.ringType)
	const construction = useAppSelector(state => state.ring.construction)
	const density = useAppSelector(state => state.ring.density)

	const dispatch = useAppDispatch()

	const { data } = useGetRingQuery(null)

	useEffect(() => {
		let ok = Boolean(ringType?.id)
		ok = ok && Boolean((ringType?.hasDensity && density) || !ringType?.hasDensity)
		ok = ok && Boolean((ringType?.hasRotaryPlug && construction) || !ringType?.hasRotaryPlug)

		if (ok) {
			dispatch(setStep({ step: 'typeStep', active: false, complete: true }))
		}
	}, [ringType, construction, density])

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
	)
}

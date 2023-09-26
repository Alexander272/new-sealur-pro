import { useEffect } from 'react'
import { Divider, Stack, Typography } from '@mui/material'
import { useGetRingSingleQuery } from '@/store/api/rings'
import { setStep, toggleActiveStep } from '@/store/rings/ring'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { Step } from '@/pages/Rings/components/Step/Step'
import { Constructions } from './components/Constructions'
import { Density } from './components/Density'
import { RingType } from './components/RingType'

export const TypeRings = () => {
	const ringType = useAppSelector(state => state.ring.ringType)
	const construction = useAppSelector(state => state.ring.construction)
	const density = useAppSelector(state => state.ring.density)

	const step = useAppSelector(state => state.ring.typeStep)

	const dispatch = useAppDispatch()

	const { data, isLoading, isError } = useGetRingSingleQuery(null)

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
			disabled={isLoading}
			toggle={toggleHandler}
		>
			{isError && (
				<Typography paddingX={2} variant='h6' color={'error'} align='center'>
					Не удалось загрузить данные
				</Typography>
			)}
			{!isError && (
				<Stack
					direction={'row'}
					divider={<Divider orientation='vertical' flexItem />}
					spacing={1}
					mr={2}
					ml={2}
				>
					{ringType?.hasRotaryPlug && (
						<Constructions
							constructionsData={data?.data.constructionsMap[ringType.id].constructions || []}
						/>
					)}
					<RingType ringData={data?.data.ringTypes || []} />
					{ringType?.hasDensity && <Density densityData={data?.data.densityMap[ringType.id].density || []} />}
				</Stack>
			)}
		</Step>
	)
}

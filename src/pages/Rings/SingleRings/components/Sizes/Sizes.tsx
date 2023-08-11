import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { Step } from '../Step/Step'
import { CustomSize } from './components/CustomSize'
import { useEffect } from 'react'
import { setStep } from '@/store/rings/ring'

export const Sizes = () => {
	const ringType = useAppSelector(state => state.ring.ringType)
	const size = useAppSelector(state => state.ring.sizes)
	const thickness = useAppSelector(state => state.ring.thickness)

	const dispatch = useAppDispatch()

	useEffect(() => {
		let ok = !size?.includes('00') && Boolean(size)
		ok = ok && (!ringType?.hasThickness || (Boolean(thickness) && thickness != '0'))

		if (ok) {
			dispatch(setStep({ step: 'sizeStep', active: false, complete: true }))
		}
	}, [size, thickness])

	return (
		<Step
			label={(size || '00×00') + (!ringType?.hasThickness ? '' : '×' + (thickness || '0'))}
			stepName={'sizeStep'}
		>
			<CustomSize hasThickness={ringType?.hasThickness} />
		</Step>
	)
}

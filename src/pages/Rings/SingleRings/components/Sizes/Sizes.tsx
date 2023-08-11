import { useAppSelector } from '@/hooks/useStore'
import { Step } from '../Step/Step'
import { CustomSize } from './components/CustomSize'

export const Sizes = () => {
	const ringType = useAppSelector(state => state.ring.ringType)
	const size = useAppSelector(state => state.ring.sizes)
	const thickness = useAppSelector(state => state.ring.thickness)

	return (
		<Step
			label={(size || '00×00') + (!ringType?.hasThickness ? '' : '×' + (thickness || '0'))}
			stepName={'sizeStep'}
		>
			<CustomSize hasThickness={ringType?.hasThickness} />
		</Step>
	)
}

import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { setStep, toggleActiveStep } from '@/store/rings/ring'
import { useGetSizeQuery } from '@/store/api/rings'
import type { IRingSize } from '@/types/rings'
import { Step } from '../../../components/Step/Step'
import { CustomSize } from './components/CustomSize'

export const Sizes = () => {
	const [sizes, setSizes] = useState<IRingSize[]>([])

	const ringType = useAppSelector(state => state.ring.ringType)
	const size = useAppSelector(state => state.ring.sizes)
	const thickness = useAppSelector(state => state.ring.thickness)

	const sizeError = useAppSelector(state => state.ring.sizeError)
	const thickError = useAppSelector(state => state.ring.thicknessError)

	const step = useAppSelector(state => state.ring.sizeStep)

	const { data } = useGetSizeQuery(null)

	const dispatch = useAppDispatch()

	useEffect(() => {
		if (!data) return

		if (ringType?.code != 'П' && ringType?.code != 'К') {
			setSizes(data?.data.sizes)
		} else {
			setSizes([])
		}
	}, [data, ringType])

	useEffect(() => {
		if (!size) return

		const s = size.split('×')

		let ok = Boolean(size) && +s[0] != 0 && +s[1] != 0
		ok = ok && (!ringType?.hasThickness || (Boolean(thickness) && thickness != '0'))
		ok = ok && !sizeError && !thickError

		if (ok) {
			dispatch(setStep({ step: 'sizeStep', complete: true }))
		} else {
			dispatch(setStep({ step: 'sizeStep', complete: false }))
		}
	}, [size, thickness])

	const toggleHandler = () => dispatch(toggleActiveStep('sizeStep'))

	return (
		<Step
			label={(size || '00×00') + (!ringType?.hasThickness ? '' : '×' + (thickness || '0'))}
			step={step}
			toggle={toggleHandler}
		>
			<CustomSize sizes={sizes} hasThickness={ringType?.hasThickness} />
			{/* {sizes.length ? <ListSize sizes={sizes} hasThickness={ringType?.hasThickness} /> : null}
			{!sizes.length ? <CustomSize sizes={sizes} hasThickness={ringType?.hasThickness} /> : null} */}
		</Step>
	)
}

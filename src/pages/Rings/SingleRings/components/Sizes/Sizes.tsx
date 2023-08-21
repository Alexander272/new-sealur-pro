import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { setStep } from '@/store/rings/ring'
import { useGetSizeQuery } from '@/store/api/rings'
import { Step } from '../Step/Step'
import { CustomSize } from './components/CustomSize'
import { IRingSize } from '@/types/rings'
import { ListSize } from './components/ListSize'

export const Sizes = () => {
	const [sizes, setSizes] = useState<IRingSize[]>([])

	const ringType = useAppSelector(state => state.ring.ringType)
	const size = useAppSelector(state => state.ring.sizes)
	const thickness = useAppSelector(state => state.ring.thickness)

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
			{sizes.length ? <ListSize sizes={sizes} hasThickness={ringType?.hasThickness} /> : null}
			{!sizes.length ? <CustomSize hasThickness={ringType?.hasThickness} /> : null}
		</Step>
	)
}

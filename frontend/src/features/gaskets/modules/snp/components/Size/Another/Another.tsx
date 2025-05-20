import { useEffect } from 'react'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getSizeErr, getSizeId, getSnpType, setSize } from '@/features/gaskets/modules/snp/snpSlice'
import { SizeField } from './SizeField'
import { Thickness } from './Thickness'

export const Another = () => {
	const snp = useAppSelector(getSnpType)
	const sizeId = useAppSelector(getSizeId)
	const errors = useAppSelector(getSizeErr)
	const dispatch = useAppDispatch()

	useEffect(() => {
		const empty = {
			id: '',
			dn: '',
			pn: '',
			pnAlt: '',
			d4: '',
			d3: '',
			d2: '',
			d1: '',
			hIndex: -1,
			h: '',
			s2: '',
			s3: '',
			another: '',
		}
		if (sizeId != '') dispatch(setSize(empty))
	}, [dispatch, sizeId])

	return (
		<>
			{snp?.hasD4 && (
				<SizeField
					title='D4, мм'
					name='d4'
					errorText={
						(errors.d4Err && 'D4 должен быть больше, чем D3') || (errors.emptyD4 && 'размер не задан') || ''
					}
				/>
			)}
			{snp?.hasD3 && (
				<SizeField
					title='D3, мм'
					name='d3'
					errorText={
						(errors.d3Err && 'D3 должен быть больше, чем D2') || (errors.emptyD3 && 'размер не задан') || ''
					}
				/>
			)}
			{snp?.hasD2 && (
				<SizeField
					title='D2, мм'
					name='d2'
					errorText={
						(errors.d2Err && 'D2 должен быть больше, чем D1') || (errors.emptyD2 && 'размер не задан') || ''
					}
				/>
			)}
			{snp?.hasD1 && (
				<SizeField title='D1, мм' name='d1' errorText={(errors.emptyD1 && 'размер не задан') || ''} />
			)}

			<Thickness />
		</>
	)
}

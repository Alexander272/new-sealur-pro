import { useEffect } from 'react'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getSnpTypeId, getStandard, setSize } from '@/features/gaskets/modules/snp/snpSlice'
import { useGetSnpSizesQuery } from '@/features/gaskets/modules/snp/snpApiSlice'
import { Dn } from './Dn'
import { D2 } from './D2'
import { Pn } from './Pn'
import { Thickness } from './Thickness'
import { Crutch } from './Crutch'

export const Standard = () => {
	const snp = useAppSelector(getSnpTypeId)
	const standard = useAppSelector(getStandard)

	const dispatch = useAppDispatch()

	const { data, isFetching, isUninitialized } = useGetSnpSizesQuery(
		{ typeId: snp, hasD2: standard?.hasD2 },
		{ skip: snp == 'not_selected' }
	)

	useEffect(() => {
		if (data) {
			const s = data.data[0]
			const size = {
				index: 0,
				dn: s.dn,
				dnMm: s.dnMm || '',
				pn: s.sizes[0].pn[0],
				d4: s.sizes[0].d4,
				d3: s.sizes[0].d3,
				d2: s.sizes[0].d2,
				d1: s.sizes[0].d1,
				h: s.sizes[0].h[0],
				s2: s.sizes[0].s2[0],
				s3: s.sizes[0].s3[0],
				another: '',
			}

			dispatch(setSize(size))
		}
	}, [data, dispatch])

	return (
		<>
			<Dn sizes={data?.data || []} isFetching={isFetching || isUninitialized} />
			{standard?.hasD2 && <D2 sizes={data?.data || []} isFetching={isFetching || isUninitialized} />}
			<Pn sizes={data?.data || []} isFetching={isFetching || isUninitialized} />
			<Thickness sizes={data?.data || []} isFetching={isFetching || isUninitialized} />
			<Crutch />
		</>
	)
}

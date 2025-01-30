import { useEffect } from 'react'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { useGetPutgSizesQuery } from '../../../putgApiSlice'
import { getConstruction, getFiller, getFlangeType, setSize } from '../../../putgSlice'
import { Dn } from './Dn'
import { Pn } from './Pn'
import { Thickness } from '../Thickness/Thickness'

export const Standard = () => {
	const construction = useAppSelector(getConstruction)
	const filler = useAppSelector(getFiller)
	const type = useAppSelector(getFlangeType)

	const dispatch = useAppDispatch()

	const { data, isFetching, isUninitialized } = useGetPutgSizesQuery(
		{ filler: filler?.baseId || '', flangeType: type?.id || '', construction: construction?.baseId || '' },
		{ skip: !filler || !type || !construction }
	)

	useEffect(() => {
		//TODO надо еще проверять если выбрана позиция из корзины, то нужно брать ее размеры
		if (data) {
			const s = data.data[0]
			if (!s) return
			const size = {
				index: 0,
				dn: s.dn,
				dnMm: s.dnMm || '',
				pn: s.sizes[0].pn[0],
				d4: s.sizes[0]?.d4 || '',
				d3: s.sizes[0].d3,
				d2: s.sizes[0].d2,
				d1: s.sizes[0]?.d1 || '',
				h: s.sizes[0].h[0],
			}

			dispatch(setSize(size))
		}
	}, [data, dispatch])

	return (
		<>
			<Dn sizes={data?.data || []} isFetching={isFetching || isUninitialized} />
			<Pn sizes={data?.data || []} isFetching={isFetching || isUninitialized} />
			<Thickness disabled={isFetching || isUninitialized} />
		</>
	)
}

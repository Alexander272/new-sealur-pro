import { useEffect } from 'react'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getActive } from '@/features/card/cardSlice'
import { useGetPutgSizesQuery } from '../../../putgApiSlice'
import { getConstruction, getFiller, getFlangeType, getSizeId, setSize, setSizeIdx } from '../../../putgSlice'
import { Dn } from './Dn'
import { Pn } from './Pn'
import { Thickness } from '../Thickness/Thickness'

export const Standard = () => {
	const active = useAppSelector(getActive)
	const construction = useAppSelector(getConstruction)
	const filler = useAppSelector(getFiller)
	const type = useAppSelector(getFlangeType)
	const sizeId = useAppSelector(getSizeId)

	const dispatch = useAppDispatch()

	const { data, isFetching, isUninitialized } = useGetPutgSizesQuery(
		{ filler: filler?.baseId || '', flangeType: type?.id || '', construction: construction?.baseId || '' },
		{ skip: !filler?.baseId || !type || !construction?.baseId }
	)

	useEffect(() => {
		if (!data || isFetching || !active) return

		const found = data.data.findIndex(s => s.sizes.some(p => p.id === sizeId))
		if (found != -1) {
			dispatch(setSizeIdx(found))
			return
		}
	}, [active, data, dispatch, isFetching, sizeId])
	useEffect(() => {
		if (!data || isFetching || active) return

		const s = data.data[0]
		if (!s) return
		const size = {
			index: 0,
			sizeId: s.sizes[0].id,
			dn: s.dn,
			dnMm: s.dnMm || '',
			pn: s.sizes[0].pn[0],
			pnIndex: 0,
			d4: s.sizes[0]?.d4 || '',
			d3: s.sizes[0].d3,
			d2: s.sizes[0].d2,
			d1: s.sizes[0]?.d1 || '',
			h: s.sizes[0].h[0],
		}

		dispatch(setSize(size))
	}, [data, isFetching, active, dispatch])

	return (
		<>
			<Dn sizes={data?.data || []} isFetching={isFetching || isUninitialized} />
			<Pn sizes={data?.data || []} isFetching={isFetching || isUninitialized} />
			<Thickness disabled={isFetching || isUninitialized} />
		</>
	)
}

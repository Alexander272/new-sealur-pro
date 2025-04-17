import { useAppSelector } from '@/hooks/redux'
import { getStandard } from '@/features/gaskets/modules/snp/snpSlice'
import { Dn } from './Dn'
import { D2 } from './D2'
import { Pn } from './Pn'
import { Thickness } from './Thickness'
import { Crutch } from './Crutch'

export const Standard = () => {
	const standard = useAppSelector(getStandard)

	// const { data, isFetching, isUninitialized } = useGetSnpGroupedSizesQuery(
	// 	{ typeId: snp, hasD2: standard?.hasD2 },
	// 	{ skip: snp == 'not_selected' }
	// )

	// useEffect(() => {
	// 	if (!data || isFetching || !active) return

	// 	const found = data.data.findIndex(s => s.sizes.some(p => p.id === sizeId))
	// 	if (found != -1) {
	// 		dispatch(setSizeIdx(found))
	// 		return
	// 	}
	// }, [active, data, dispatch, isFetching, sizeId])
	// useEffect(() => {
	// 	if (!data || isFetching || active) return

	// 	const s = data.data[0]
	// 	if (!s) return
	// 	const size = {
	// 		index: 0,
	// 		sizeId: s.sizes[0].id,
	// 		dn: s.dn,
	// 		dnMm: s.dnMm || '',
	// 		pn: s.sizes[0].pn[0],
	// 		pnIndex: 0,
	// 		d4: s.sizes[0].d4,
	// 		d3: s.sizes[0].d3,
	// 		d2: s.sizes[0].d2,
	// 		d1: s.sizes[0].d1,
	// 		h: s.sizes[0].h[0],
	// 		hIndex: 0,
	// 		s2: s.sizes[0].s2[0],
	// 		s3: s.sizes[0].s3[0],
	// 		another: '',
	// 	}

	// 	dispatch(setSize(size))
	// }, [data, active, dispatch, isFetching])

	return (
		<>
			<Dn />
			{standard?.hasD2 && <D2 />}
			<Pn />
			<Thickness />
			<Crutch />
		</>
	)
}

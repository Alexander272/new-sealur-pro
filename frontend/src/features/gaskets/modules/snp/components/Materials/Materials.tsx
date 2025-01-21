import { FC, useEffect } from 'react'
import { toast } from 'react-toastify'

import { useAppSelector } from '@/hooks/redux'
import { AsideContainer } from '@/features/gaskets/components/Skeletons/gasket.style'
import { getMaterials, getSnpTypeId, getThickness } from '../../snpSlice'
import { useGetSnpInfoQuery } from '../../snpApiSlice'
import { Material } from './Material'
import { Filler } from './Filler'

type Props = unknown

// часть с наполнителями и материалами каркаса и колец
export const Materials: FC<Props> = () => {
	const materials = useAppSelector(getMaterials)
	const thickness = useAppSelector(getThickness)
	const snp = useAppSelector(getSnpTypeId)

	const { data, isFetching } = useGetSnpInfoQuery(snp, { skip: snp == 'not_selected' })

	useEffect(() => {
		if (
			(materials?.innerRing?.baseCode === '3Ti' && thickness == '3,2') ||
			(materials?.outerRing?.baseCode === '3Ti' && thickness == '3,2')
		) {
			toast.error('Данная сталь недоступна с текущей толщиной')
		}
	}, [thickness, materials])

	return (
		<AsideContainer>
			<Filler />

			<Material
				title='Материал каркаса'
				type='frame'
				disabled={!data?.data.hasFrame || isFetching}
				isEmpty={!data?.data.hasFrame}
			/>
			<Material
				title='Материал внутреннего кольца'
				type='innerRing'
				disabled={!data?.data.hasInnerRing || isFetching}
				isEmpty={!data?.data.hasInnerRing}
			/>
			<Material
				title='Материал наружного кольца'
				type='outerRing'
				disabled={!data?.data.hasOuterRing || isFetching}
				isEmpty={!data?.data.hasOuterRing}
			/>
		</AsideContainer>
	)
}

import { FC, useEffect } from 'react'
import { toast } from 'react-toastify'

import { useAppSelector } from '@/hooks/redux'
import { MaterialSkeleton } from '@/features/gaskets/components/Skeletons/MaterialSkeleton'
import { AsideContainer } from '@/features/gaskets/components/Skeletons/gasket.style'
import { getMaterials, getReady, getSnpTypeId, getThickness } from '../../snpSlice'
import { Material } from './Material'
import { Filler } from './Filler'
import { useGetSnpInfoQuery } from '../../snpApiSlice'

type Props = unknown

// часть с наполнителями и материалами каркаса и колец
export const Materials: FC<Props> = () => {
	const isReady = useAppSelector(getReady)
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

	if (!isReady) {
		return (
			<AsideContainer>
				<MaterialSkeleton />
			</AsideContainer>
		)
	}

	return (
		<AsideContainer>
			<Filler />

			<Material title='Материал каркаса' type='frame' disabled={!data?.data.hasFrame || isFetching} />
			<Material
				title='Материал внутреннего кольца'
				type='innerRing'
				disabled={!data?.data.hasInnerRing || isFetching}
			/>
			<Material
				title='Материал наружного кольца'
				type='outerRing'
				disabled={!data?.data.hasOuterRing || isFetching}
			/>
		</AsideContainer>
	)
}

import { useAppSelector } from '@/hooks/redux'
import { AsideContainer } from '@/features/gaskets/components/Skeletons/gasket.style'
import { Plating } from './Plating'
import { Material } from './Material'
import { getConstruction } from '../../serratedSlice'

export const Materials = () => {
	const construction = useAppSelector(getConstruction)

	return (
		<AsideContainer>
			<Plating />

			<Material title='Материал основания' type='base' related='rotaryPlug' />
			<Material
				title='Материал обтюраторов'
				type='rotaryPlug'
				disabled={!construction?.hasMaterial}
				isEmpty={!construction?.hasMaterial}
			/>
		</AsideContainer>
	)
}

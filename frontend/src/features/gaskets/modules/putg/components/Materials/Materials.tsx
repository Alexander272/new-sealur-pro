import { AsideContainer } from '@/features/gaskets/components/Skeletons/gasket.style'
import { useAppSelector } from '@/hooks/redux'
import { getConstruction } from '../../putgSlice'
import { Filler } from './Filler'
import { Material } from './Material'

export const Materials = () => {
	const construction = useAppSelector(getConstruction)

	return (
		<AsideContainer>
			<Filler />

			<Material
				title='Материал обтюраторов'
				type='rotaryPlug'
				disabled={!construction?.hasRotaryPlug}
				isEmpty={!construction?.hasRotaryPlug}
			/>
			<Material
				title='Материал внутреннего ограничителя'
				type='innerRing'
				disabled={!construction?.hasInnerRing}
				isEmpty={!construction?.hasInnerRing}
			/>
			<Material
				title='Материал внешнего ограничителя'
				type='outerRing'
				disabled={!construction?.hasOuterRing}
				isEmpty={!construction?.hasOuterRing}
			/>
		</AsideContainer>
	)
}

import { AsideContainer } from '@/features/gaskets/components/Skeletons/gasket.style'
import { Filler } from './Filler'
import { Material } from './Material'

export const Materials = () => {
	return (
		<AsideContainer>
			<Filler />
			<Material title='Материал оболочки' type='shell' />
		</AsideContainer>
	)
}

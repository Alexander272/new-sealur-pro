import { AsideContainer } from '@/features/gaskets/components/Skeletons/gasket.style'
import { Material } from './Material'

export const Materials = () => {
	return (
		<AsideContainer>
			<Material title='Материал основания' />
			<Material title='Материал плакировки' />
			<Material title='Материал обтюраторов' />
		</AsideContainer>
	)
}

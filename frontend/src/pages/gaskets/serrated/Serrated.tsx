import { Content, PageTitle } from '@/features/gaskets/components/Skeletons/gasket.style'
import { Design } from '@/features/gaskets/modules/serrated/components/Design/Design'
import { Main } from '@/features/gaskets/modules/serrated/components/Main/Main'
import { Materials } from '@/features/gaskets/modules/serrated/components/Material/Materials'
import { Result } from '@/features/gaskets/modules/serrated/components/Result/Result'
import { Size } from '@/features/gaskets/modules/serrated/components/Size/Size'

export default function Serrated() {
	return (
		<>
			<PageTitle>Прокладки на металлическом зубчатом основании</PageTitle>
			<Content>
				<Main />
				<Materials />
				<Size />
				<Design />
				<Result />
			</Content>
		</>
	)
}

import { Content, PageTitle } from '@/features/gaskets/components/Skeletons/gasket.style'
import { Materials } from '@/features/gaskets/modules/wave/components/Material/Materials'
import { Main } from '@/features/gaskets/modules/wave/components/Main/Main'
import { Size } from '@/features/gaskets/modules/wave/components/Size/Size'
import { Design } from '@/features/gaskets/modules/wave/components/Design/Design'
import { Result } from '@/features/gaskets/modules/wave/components/Result/Result'

export default function Wave() {
	return (
		<>
			<PageTitle>Прокладки на металлическом волновом основании</PageTitle>
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

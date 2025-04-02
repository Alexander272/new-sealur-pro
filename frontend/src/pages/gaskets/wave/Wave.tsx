import { Content, PageTitle } from '@/features/gaskets/components/Skeletons/gasket.style'
import { Materials } from '@/features/gaskets/modules/wave/components/Material/Materials'
import { Main } from '@/features/gaskets/modules/wave/components/Main/Main'
import { Size } from '@/features/gaskets/modules/wave/components/Size/Size'

export default function Wave() {
	return (
		<>
			<PageTitle>Волновые прокладки</PageTitle>
			<Content>
				<Main />
				<Materials />
				<Size />
				{/* <Design />
				<Result />*/}
			</Content>
		</>
	)
}

import { Content } from '@/components/Layout/Header/header.style'
import { PageTitle } from '@/features/gaskets/components/Skeletons/gasket.style'
import { Main } from '@/features/gaskets/modules/wave/components/Main/Main'

export default function Wave() {
	return (
		<>
			<PageTitle>Волновые прокладки</PageTitle>
			<Content>
				<Main />
				{/* <Materials />
				<Size />
				<Design />
				<Result /> */}
			</Content>
		</>
	)
}

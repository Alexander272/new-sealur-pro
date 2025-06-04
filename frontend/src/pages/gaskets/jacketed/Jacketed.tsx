import { Content, PageTitle } from '@/features/gaskets/components/Skeletons/gasket.style'
import { Main } from '@/features/gaskets/modules/jacketed/components/Main/Main'

export default function Jacketed() {
	return (
		<>
			<PageTitle>Прокладки завальцованные</PageTitle>
			<Content>
				<Main />
				{/*<Materials />
				<Size />
				<Design />
				<Result /> */}
			</Content>
		</>
	)
}

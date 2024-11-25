import { Content, PageTitle } from '@/features/gaskets/components/Skeletons/gasket.style'
import { Main } from '@/features/gaskets/modules/snp/components/Main/Main'
import { Materials } from '@/features/gaskets/modules/snp/components/Materials/Materials'

export default function Snp() {
	return (
		<>
			<PageTitle>Спирально-навитые прокладки</PageTitle>
			<Content>
				<Main />
				<Materials />
				{/* <Size />
				<Design />
				<Result /> */}
			</Content>
		</>
	)
}

import { Content, PageTitle } from '@/features/gaskets/components/Skeletons/gasket.style'
import { Design } from '@/features/gaskets/modules/jacketed/components/Design/Design'
import { Main } from '@/features/gaskets/modules/jacketed/components/Main/Main'
import { Materials } from '@/features/gaskets/modules/jacketed/components/Materials/Materials'
import { Result } from '@/features/gaskets/modules/jacketed/components/Result/Result'
import { Sizes } from '@/features/gaskets/modules/jacketed/components/Sizes/Sizes'

export default function Jacketed() {
	return (
		<>
			<PageTitle>Прокладки завальцованные</PageTitle>
			<Content>
				<Main />
				<Materials />
				<Sizes />
				<Design />
				<Result />
			</Content>
		</>
	)
}

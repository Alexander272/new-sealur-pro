import { Content, PageTitle } from '@/features/gaskets/components/Skeletons/gasket.style'
import { Design } from '@/features/gaskets/modules/snp/components/Design/Design'
import { Main } from '@/features/gaskets/modules/snp/components/Main/Main'
import { Materials } from '@/features/gaskets/modules/snp/components/Materials/Materials'
import { Result } from '@/features/gaskets/modules/snp/components/Result/Result'
import { Size } from '@/features/gaskets/modules/snp/components/Size/Size'

export default function Snp() {
	return (
		<>
			<PageTitle>Спирально-навитые прокладки</PageTitle>
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

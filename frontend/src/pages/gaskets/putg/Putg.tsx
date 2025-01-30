import { Content, PageTitle } from '@/features/gaskets/components/Skeletons/gasket.style'
import { Design } from '@/features/gaskets/modules/putg/components/Design/Design'
import { Main } from '@/features/gaskets/modules/putg/components/Main/Main'
import { Materials } from '@/features/gaskets/modules/putg/components/Materials/Materials'
import { Result } from '@/features/gaskets/modules/putg/components/Result/Result'
import { Size } from '@/features/gaskets/modules/putg/components/Size/Size'

export default function Putg() {
	return (
		<>
			<PageTitle>Прокладки уплотнительные из терморасширенного графита</PageTitle>
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

import { Content, PageTitle } from '../gasket.style'
import { Main } from './components/Main/Main'
import { Materials } from './components/Materials/Materials'
import { Design } from './components/Design/Design'
import { Size } from './components/Size/Size'
import { Result } from './components/Result/Result'

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

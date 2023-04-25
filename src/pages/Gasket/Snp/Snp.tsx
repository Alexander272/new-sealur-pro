import { Content, PageTitle } from '../gasket.style'
import { Main } from './components/Main/Main'
import { Materials } from './components/Materials/Materials'
import { Size } from './components/Size/Size'
import { Design } from './components/Design/Design'
import { Result } from './components/Result/Result'

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

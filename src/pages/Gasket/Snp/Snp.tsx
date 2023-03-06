import { useAppSelector } from '@/hooks/useStore'
import { Content, PageTitle } from '../gasket.style'
import { Design } from './components/Design/Design'
import { Main } from './components/Main/Main'
import { Materials } from './components/Materials/Materials'
import { Result } from './components/Result/Result'
import { Size } from './components/Size/Size'

export default function Snp() {
	const main = useAppSelector(state => state.snp.main)

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

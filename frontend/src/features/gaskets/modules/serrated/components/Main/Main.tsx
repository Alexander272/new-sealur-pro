import { Column, MainContainer } from '@/features/gaskets/components/Skeletons/gasket.style'
import { Standards } from './Standards'
import { FlangeType } from './Flange'
import { Gasket } from './Gasket'
import { Construction } from './Construction'
import { Drawing } from './Drawing'

export const Main = () => {
	return (
		<MainContainer>
			<Column>
				<Standards />
				<FlangeType />
				<Gasket />
				<Construction />
			</Column>

			<Drawing />
		</MainContainer>
	)
}

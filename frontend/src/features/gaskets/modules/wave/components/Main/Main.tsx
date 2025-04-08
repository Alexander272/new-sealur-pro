import { Column, MainContainer } from '@/features/gaskets/components/Skeletons/gasket.style'
import { Configuration } from './Configuration'
import { Standards } from './Standards'
import { FlangeType } from './Flange'
import { Gasket } from './Gasket'
import { Construction } from './Construction'
import { Drawing } from './Drawing'

export const Main = () => {
	return (
		<MainContainer>
			<Column>
				<Configuration />
				<Standards />
				<FlangeType />
				<Gasket />
				<Construction />
			</Column>

			<Drawing />
		</MainContainer>
	)
}

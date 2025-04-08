import { Column, MainContainer } from '@/features/gaskets/components/Skeletons/gasket.style'
import { Configuration } from './Configuration'
import { Standards } from './Standards'
import { Flange } from './Flange'
import { Gasket } from './Gasket'
import { Construction } from './Construction'
import { Drawing } from './Drawing'

export const Main = () => {
	return (
		<MainContainer>
			<Column>
				<Configuration />
				<Standards />
				<Flange />
				<Gasket />
				<Construction />
			</Column>

			<Drawing />
		</MainContainer>
	)
}

import { Typography } from '@mui/material'

import { Column, MainContainer } from '@/features/gaskets/components/Skeletons/gasket.style'
import { Standards } from './Standards'
import { FlangeType } from './Flange'
import { Gasket } from './Gasket'
import { Construction } from './Construction'

export const Main = () => {
	return (
		<MainContainer>
			<Column>
				<Standards />
				<FlangeType />
				<Gasket />
				<Construction />
			</Column>

			<Column>
				<Typography fontWeight='bold'>Чертеж фланца с прокладкой</Typography>
			</Column>
		</MainContainer>
	)
}

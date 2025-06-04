import { FC } from 'react'

import { MainContainer, Column } from '@/features/gaskets/components/Skeletons/gasket.style'
import { Standards } from './Standards'
import { Flange } from './Flange'
import { Type } from './Type'
import { Drawing } from './Drawing'

type Props = unknown

// часть со стандартами, типами фланцев и типами снп
export const Main: FC<Props> = () => {
	return (
		<MainContainer>
			<Column>
				<Standards />
				<Flange />
				<Type />
			</Column>

			<Drawing />
		</MainContainer>
	)
}

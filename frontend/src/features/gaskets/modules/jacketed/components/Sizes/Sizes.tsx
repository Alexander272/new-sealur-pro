import { useAppSelector } from '@/hooks/redux'
import { Column, SizeContainer } from '@/features/gaskets/components/Skeletons/gasket.style'
import { getStandard } from '../../jacketedSlice'
import { Standard } from './Standard/Standard'
import { Another } from './Another/Another'
import { Drawing } from './Drawing'

export const Sizes = () => {
	const standard = useAppSelector(getStandard)

	return (
		<SizeContainer>
			<Column width={40}>
				{!standard?.flangeStandard || standard?.flangeStandard?.code ? <Standard /> : <Another />}
			</Column>

			<Drawing />
		</SizeContainer>
	)
}

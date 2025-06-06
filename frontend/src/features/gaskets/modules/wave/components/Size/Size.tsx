import { useAppSelector } from '@/hooks/redux'
import { Column, SizeContainer } from '@/features/gaskets/components/Skeletons/gasket.style'
import { Standard } from './Standard/Standard'
import { Configuration } from './Configuration/Configuration'
import { getConfiguration, getStandard } from '../../waveSlice'
import { Drawing } from './Drawing'
import { Another } from './Another/Another'

export const Size = () => {
	const configuration = useAppSelector(getConfiguration)
	const standard = useAppSelector(getStandard)

	return (
		<SizeContainer>
			<Column width={40}>
				{configuration && configuration?.code !== 'round' ? (
					configuration?.code == 'rectangular' && <Configuration />
				) : standard?.flangeStandard?.code ? (
					<Standard />
				) : (
					<Another />
				)}
			</Column>

			<Drawing />
		</SizeContainer>
	)
}

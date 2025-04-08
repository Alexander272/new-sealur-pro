import { useAppSelector } from '@/hooks/redux'
import { Column, SizeContainer } from '@/features/gaskets/components/Skeletons/gasket.style'
import { SizeSkeleton } from '@/features/gaskets/components/Skeletons/SizeSkeleton'
import { getConfiguration, getStandard } from '../../putgSlice'
import { Configuration } from './Configuration/Configuration'
import { Standard } from './Standard/Standard'
import { Another } from './Another/Another'
import { Drawing } from './Drawing'

export const Size = () => {
	const configuration = useAppSelector(getConfiguration)
	const standard = useAppSelector(getStandard)

	return (
		<SizeContainer>
			{configuration ? (
				<Column width={40}>
					{!standard?.flangeStandard || standard?.flangeStandard?.code ? (
						<Standard />
					) : configuration?.code === 'round' ? (
						<Another />
					) : (
						<Configuration />
					)}
				</Column>
			) : (
				<SizeSkeleton />
			)}

			<Drawing />
		</SizeContainer>
	)
}

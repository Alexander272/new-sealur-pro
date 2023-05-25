import { FC } from 'react'
import { useAppSelector } from '@/hooks/useStore'
import { Container, Size } from './size.style'

type Props = {}

export const PartSizeBlock: FC<Props> = () => {
	const sizes = useAppSelector(state => state.putg.size)

	return (
		<Container>
			{sizes.useDimensions && (
				<>
					<Size top={'77%'}>{sizes.d4?.replace('.', ',')}</Size>
					<Size top={'77%'}>{sizes.d3?.replace('.', ',')}</Size>
					<Size top={'77%'}>{sizes.d2?.replace('.', ',')}</Size>
					<Size top={'77%'}>{sizes.d1?.replace('.', ',')}</Size>
				</>
			)}

			{!sizes.useDimensions && (
				<>
					<Size top={'77%'}>{sizes.d3?.replace('.', ',')}</Size>
					<Size top={'77%'}>{sizes.d2?.replace('.', ',')}</Size>
					<Size top={'77%'}>{sizes.d1?.replace('.', ',')}</Size>
				</>
			)}
		</Container>
	)
}

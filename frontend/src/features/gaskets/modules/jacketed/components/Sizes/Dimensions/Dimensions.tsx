import { useAppSelector } from '@/hooks/redux'
import { Container, Description, Size } from '@/components/Size/size.style'
import { getSize } from '../../../jacketedSlice'

export const Dimensions = () => {
	const sizes = useAppSelector(getSize)

	return (
		<Container>
			<Size bottom={'9%'}>
				&#8960; {sizes.d3.replace('.', ',')} <Description>(D2)</Description>
			</Size>
			<Size bottom={'28%'}>
				&#8960; {sizes.d2.replace('.', ',')} <Description>(D1)</Description>
			</Size>
		</Container>
	)
}

import { useAppSelector } from '@/hooks/redux'
import { Container, Description, Size } from '@/components/Size/size.style'
import { getSize, getType } from '../../../waveSlice'

export const Dimensions = () => {
	const type = useAppSelector(getType)
	const sizes = useAppSelector(getSize)

	return (
		<Container>
			{type?.hasD4 && (
				<Size bottom={'15%'}>
					&#8960; {sizes.d4?.replace('.', ',')} <Description>(D4)</Description>
					{sizes.d4?.replace('.', ',')} <Description>(D4)</Description>
				</Size>
			)}
			{type?.hasD3 && (
				<Size bottom={'30%'}>
					&#8960; {sizes.d3.replace('.', ',')} <Description>(D3)</Description>
				</Size>
			)}
			{type?.hasD2 && (
				<Size bottom={'45%'}>
					&#8960; {sizes.d2.replace('.', ',')} <Description>(D2)</Description>
				</Size>
			)}
			{type?.hasD1 && (
				<Size bottom={'59%'}>
					&#8960; {sizes.d1?.replace('.', ',')} <Description>(D1)</Description>
				</Size>
			)}
		</Container>
	)
}

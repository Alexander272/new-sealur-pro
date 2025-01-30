import { useAppSelector } from '@/hooks/redux'
import { Container, Description, Size } from './size.style'
import { getConstruction, getSizes } from '../../../putgSlice'

export const SizesBlock = () => {
	const construction = useAppSelector(getConstruction)
	const sizes = useAppSelector(getSizes)

	return (
		<Container>
			{construction?.hasD4 && (
				<Size top={'77%'}>
					{sizes.d4?.replace('.', ',')} <Description>(D4)</Description>
				</Size>
			)}
			{construction?.hasD3 && (
				<Size top={'64%'}>
					{sizes.d3.replace('.', ',')} <Description>(D3)</Description>
				</Size>
			)}
			{construction?.hasD2 && (
				<Size top={'51%'}>
					{sizes.d2.replace('.', ',')} <Description>(D2)</Description>
				</Size>
			)}
			{construction?.hasD1 && (
				<Size top={'38%'}>
					{sizes.d1?.replace('.', ',')} <Description>(D1)</Description>
				</Size>
			)}
		</Container>
	)
}

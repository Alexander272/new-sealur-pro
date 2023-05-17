import { useAppSelector } from '@/hooks/useStore'
import { Container, Description, Size } from './size.style'

const sizePositionsPutg = {}

export const SizesBlockPutg = () => {
	const material = useAppSelector(state => state.putg.material)
	const sizes = useAppSelector(state => state.putg.size)

	// if (!main.snpType?.title) return null

	return (
		<Container>
			{material.construction?.hasD4 && (
				<Size top={'77%'}>
					{sizes.d4?.replace('.', ',')} <Description>(D4)</Description>
				</Size>
			)}
			{material.construction?.hasD3 && (
				<Size top={'64%'}>
					{sizes.d3.replace('.', ',')} <Description>(D3)</Description>
				</Size>
			)}
			{material.construction?.hasD2 && (
				<Size top={'51%'}>
					{sizes.d2.replace('.', ',')} <Description>(D2)</Description>
				</Size>
			)}
			{material.construction?.hasD1 && (
				<Size top={'38%'}>
					{sizes.d1?.replace('.', ',')} <Description>(D1)</Description>
				</Size>
			)}
		</Container>
	)
}

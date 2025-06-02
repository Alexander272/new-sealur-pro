import { useAppSelector } from '@/hooks/redux'
import { Container, Description, Size } from '@/components/Size/size.style'
import { getSize } from '../../../waveSlice'

export const NotRoundDimensions = () => {
	const sizes = useAppSelector(getSize)

	// if (sizes.useDimensions)
	// 	return (
	// 		<Container>
	// 			<Size top={'87%'} left='55%'>
	// 				{sizes.d4?.replace('.', ',')} <Description>(A1)</Description>
	// 			</Size>
	// 			<Size top={'71%'} left='55%'>
	// 				{sizes.d3?.replace('.', ',')} <Description>(A2)</Description>
	// 			</Size>
	// 			<Size top={'23%'} left='5%' hasRotate>
	// 				{sizes.d2?.replace('.', ',')} <Description>(B1)</Description>
	// 			</Size>
	// 			<Size top={'24%'} left='17%' hasRotate>
	// 				{sizes.d1?.replace('.', ',')} <Description>(B2)</Description>
	// 			</Size>
	// 		</Container>
	// 	)

	return (
		<Container>
			<Size top={'87%'} left='55%'>
				{sizes.d3?.replace('.', ',')} <Description>(A1)</Description>
			</Size>
			<Size top={'23%'} left='5%' hasRotate>
				{sizes.d2?.replace('.', ',')} <Description>(B1)</Description>
			</Size>
			<Size top={'12%'} left='90%'>
				{sizes.d1?.replace('.', ',')} <Description>(C)</Description>
			</Size>
		</Container>
	)
}

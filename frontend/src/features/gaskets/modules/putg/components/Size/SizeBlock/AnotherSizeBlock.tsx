import { FC } from 'react'

import { useAppSelector } from '@/hooks/redux'
import { Container, Description, Size } from './size.style'
import { getSizes } from '../../../putgSlice'

type Props = unknown

export const AnotherSizeBlock: FC<Props> = () => {
	const sizes = useAppSelector(getSizes)

	return (
		<Container>
			{sizes.useDimensions && (
				<>
					<Size top={'87%'} left='55%'>
						{sizes.d4?.replace('.', ',')} <Description>(A1)</Description>
					</Size>
					<Size top={'69%'} left='55%'>
						{sizes.d3?.replace('.', ',')} <Description>(A2)</Description>
					</Size>
					<Size top={'33%'} left='4%' hasRotate>
						{sizes.d2?.replace('.', ',')} <Description>(B1)</Description>
					</Size>
					<Size top={'33%'} left='17%' hasRotate>
						{sizes.d1?.replace('.', ',')} <Description>(B2)</Description>
					</Size>
				</>
			)}

			{!sizes.useDimensions && (
				<>
					<Size top={'87%'} left='55%'>
						{sizes.d3?.replace('.', ',')} <Description>(A1)</Description>
					</Size>
					<Size top={'33%'} left='4%' hasRotate>
						{sizes.d2?.replace('.', ',')} <Description>(B1)</Description>
					</Size>
					<Size top={'12%'} left='90%'>
						{sizes.d1?.replace('.', ',')} <Description>(C)</Description>
					</Size>
				</>
			)}
		</Container>
	)
}

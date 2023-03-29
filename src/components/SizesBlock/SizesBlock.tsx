import { FC } from 'react'
import { Tooltip } from '@mui/material'
import { ISizeBlockSnp } from '@/types/snp'
import { Description, SizesProps, Size, Container, Question } from './sizes.style'

type Position = {
	frame: SizesProps
	ring: SizesProps
	twisted: SizesProps
	d4: SizesProps
	d3: SizesProps
	d2: SizesProps
	d1: SizesProps
}

type HasSizes = {
	hasD4?: boolean
	hasD3?: boolean
	hasD2?: boolean
	hasD1?: boolean
}

type Props = {
	sizes: ISizeBlockSnp
	hasSizes: HasSizes
	hasD2?: boolean
	positions: Position
}

export const SizesBlock: FC<Props> = ({ sizes, hasSizes, hasD2, positions }) => {
	if (!positions) return null

	return (
		<Container>
			<Size top={positions.frame?.top} left={positions.frame?.left}>
				{sizes.h === 'another' ? sizes.another : sizes.h}{' '}
				<Tooltip title='толщина каркаса' arrow>
					<Question>?</Question>
				</Tooltip>
			</Size>
			{sizes.s2 && positions.ring?.top ? (
				<Size top={positions.ring?.top} left={positions.ring?.left}>
					{sizes.s2}{' '}
					<Tooltip title='толщина ограничительного кольца' arrow>
						<Question>?</Question>
					</Tooltip>
				</Size>
			) : null}
			{sizes.s3 && positions.twisted?.top ? (
				<Size top={positions.twisted?.top} left={positions.twisted?.left}>
					{sizes.s3}{' '}
					<Tooltip title='толщина спирально-навитой части' arrow>
						<Question>?</Question>
					</Tooltip>
				</Size>
			) : null}

			{hasSizes.hasD4 && (
				<Size top={positions.d4?.top} left={positions.d4?.left}>
					{sizes.d4} <Description>(D4)</Description>
				</Size>
			)}
			{hasSizes.hasD3 && (
				<Size top={positions.d3?.top} left={positions.d3?.left}>
					{sizes.d3} <Description>(D3)</Description>
				</Size>
			)}
			{hasSizes.hasD2 && (
				<Size top={positions.d2?.top} left={positions.d2?.left}>
					{sizes.d2} <Description select={hasD2}>(D2)</Description>
				</Size>
			)}
			{hasSizes.hasD1 && (
				<Size top={positions.d1?.top} left={positions.d1?.left}>
					{sizes.d1} <Description>(D1)</Description>
				</Size>
			)}
		</Container>
	)
}

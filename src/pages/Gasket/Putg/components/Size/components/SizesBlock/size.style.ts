// import styled from 'styled-components'
import styled from '@emotion/styled'

export const Container = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	display: flex;
	justify-content: center;
`

export type SizesProps = {
	top?: string
	left?: string
	hasRotate?: boolean
}
export const Size = styled.p<SizesProps>`
	position: absolute;
	font-size: 0.85rem;
	margin: 0;
	top: ${props => (props.top ? props.top : '0')};
	left: ${props => (props.left ? props.left : 'auto')};
	transform: ${props => props.hasRotate && 'rotate(-90deg)'};
	text-align: center;
`

type DescriptionProps = {
	select?: boolean
}
export const Description = styled.span<DescriptionProps>`
	color: ${props => (props.select ? '#062e93' : '#8c8e91')};
`

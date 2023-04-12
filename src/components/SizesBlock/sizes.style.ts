import styled from 'styled-components'

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
}
export const Size = styled.p<SizesProps>`
	position: absolute;
	font-size: 0.85rem;
	margin: 0;
	top: ${props => (props.top ? props.top : '0')};
	left: ${props => (props.left ? props.left : 'auto')};
	text-align: center;
`

type DescriptionProps = {
	select?: boolean
}
export const Description = styled.span<DescriptionProps>`
	color: ${props => (props.select ? '#062e93' : '#8c8e91')};
`

export const Question = styled.span`
	border-radius: 50%;
	line-height: 14px;
	border: 1px dotted var(--primary-color);
	color: var(--primary-color);
	display: inline-block;
	width: 14px;
	vertical-align: super;
	font-size: 10px;
	cursor: pointer;
`

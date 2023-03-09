import styled from 'styled-components'

export const Container = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	/* display: flex; */
	/* justify-content: center; */
`

export type BacklightProps = {
	width: string
	height: string
	top?: string
	left?: string
	background?: string
}

export const BacklightBlock = styled.div<BacklightProps>`
	background: ${props => (props.background ? props.background : 'var(--primary-color)')};
	mix-blend-mode: color;
	position: absolute;
	height: ${props => props.height};
	width: ${props => props.width};
	top: ${props => (props.top ? props.top : '0')};
	left: ${props => (props.left ? props.left : '0')};
`

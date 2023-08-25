import styled from 'styled-components'

export const Container = styled.div<ContainerProps>`
	position: relative;
	display: flex;
	max-width: 500px;
	width: ${props => (props.open ? '100%' : '0px')};
	transition: width 0.3s ease-in-out;
	margin: 10px 0;
	/* margin-left: auto; */
	/* height: calc(100vh - 170px); */

	@media screen and (max-width: 1600px) {
		position: fixed;
		z-index: 30;
		right: 0;
		top: 10px;
		/* height: calc(100% - 20px); */
		height: calc(100vh - 30px);
	}
`

type ContainerProps = {
	open?: boolean
}
export const CardContainer = styled.div<ContainerProps>`
	flex-grow: 1;
	padding: ${props => (props.open ? '10px 20px' : '0')};
	border-radius: 12px;
	background-color: var(--theme-bg-color);
	box-shadow: 0px 0px 4px 0px #2626262b;
	/* width: ${props => (props.open ? '500px' : '0px')}; */
	/* overflow: hidden; */
	display: flex;
	flex-direction: column;
	position: relative;
	/* transition: width 0.2s ease-in-out; */

	/* @media screen and (max-width: 1400px) {
		position: absolute;
		right: 0;
		height: calc(100% - 20px);
	} */
`

export const Positions = styled.div`
	max-height: 600px;
	overflow-y: auto;
	overflow-x: hidden;
	position: relative;
`

export const Item = styled.div`
	position: relative;
`

type PositionProps = {
	active?: boolean
}
export const Position = styled.p<PositionProps>`
	margin: 0;
	margin-bottom: 6px;
	padding-right: 15px;
	/* width: 480px; */
	cursor: pointer;
	color: ${props => (props.active ? 'var(--primary-color)' : 'black')};
	font-weight: ${props => (props.active ? 'bold' : 'inherit')};
	transition: all 0.3s ease-in-out;

	&:hover {
		color: var(--primary-color);
	}
`

type ButtonProps = {}
export const CircleButton = styled.div<ContainerProps>`
	transform: ${props => (props.open ? 'rotate(0deg)' : 'rotate(180deg)')};
	position: absolute;
	left: ${props => (props.open ? '0' : 'inherit')};
	right: ${props => (props.open ? 'inherit' : '-5px')};
	bottom: 180px;
	border-radius: 0 70px 70px 0;
	background-color: var(--secondary-color);
	font-size: 1.8rem;
	padding: 8px 16px 8px 0;
	color: var(--primary-color);
	cursor: pointer;
	z-index: 5;
`

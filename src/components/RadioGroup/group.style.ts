import styled from 'styled-components'

export const Group = styled.div`
	background-color: var(--secondary-color);
	border-radius: 40px;
	box-shadow: 2px 2px 3px 0 rgb(38 38 38 / 17%);
	display: flex;
	position: relative;
	width: fit-content;
	/* padding: 3px; */
	pointer-events: none;
`

type ItemProps = {
	active?: boolean
}

export const Item = styled.div<ItemProps>`
	border-radius: 40px;
	color: ${props => (props.active ? '#fff' : 'var(--primary-color)')};
	cursor: pointer;
	font-weight: 500;
	padding: 5px 14px;
	position: relative;
	transition: all 0.3s ease-in-out;
	white-space: nowrap;
	z-index: 5;
	font-weight: bold;
	pointer-events: ${props => (props.active ? 'none' : 'all')};

	&:hover {
		background-color: #fff;
	}
`

type ActiveProps = {
	width: number
	left: number
}

export const ActiveItem = styled.div<ActiveProps>`
	position: absolute;
	background-color: var(--primary-color);
	border-radius: 40px;
	display: block;
	height: 100%;
	transition: width 0.2s, left 0.2s;
	z-index: 1;
	width: ${props => props.width + 'px'};
	left: ${props => props.left + 'px'};
`

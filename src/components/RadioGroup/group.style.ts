import styled from '@emotion/styled'

export const Group = styled.div`
	background-color: var(--secondary-color);
	border-radius: 40px;
	box-shadow: 2px 2px 3px 0 rgb(38 38 38 / 17%);
	display: flex;
	position: relative;
	width: fit-content;
	max-width: 100%;
	pointer-events: none;
`

type ItemProps = {
	active?: boolean
	disabled?: boolean
	size: 'large' | 'middle'
}

export const Item = styled.div<ItemProps>`
	border-radius: 40px;
	color: ${props => (props.active ? '#fff' : props.disabled ? '#8298a9' : 'var(--primary-color)')};
	cursor: pointer;
	font-weight: 500;
	padding: ${props => (props.size === 'middle' ? '5px 14px' : '5px 24px')};
	position: relative;
	transition: all 0.3s ease-in-out;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	z-index: 5;
	font-weight: bold;
	pointer-events: ${props => (props.active ? 'none' : 'all')};

	&:hover {
		background-color: ${props => !props.active && '#fff'};
	}

	@media screen and (max-width: 500px) {
		font-size: 0.8rem;
		line-height: 1;
		padding-top: 10px;
		padding-bottom: 10px;
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

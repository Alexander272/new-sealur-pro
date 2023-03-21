import styled from 'styled-components'

export const Container = styled.div`
	margin: 0 auto;
	width: 1560px;
	padding: 20px 30px;
	border-radius: 12px;
	background-color: var(--theme-bg-color);
	box-shadow: 0px 0px 4px 0px #2626262b;
	display: flex;
	flex-wrap: wrap;
`

export const ItemBlock = styled.div`
	padding: 10px 16px;
	border-radius: 12px;
	border: 2px solid var(--secondary-color);
`

export const Icon = styled.img`
	pointer-events: none;
`

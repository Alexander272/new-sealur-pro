import styled from 'styled-components'

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: 14px;
	flex-grow: 1;
	justify-content: center;
	align-items: center;
`

export const Hidden = styled.div`
	overflow: hidden;
	height: 0;
`

export const OrderList = styled.div`
	width: 800px;
	padding: 20px 30px;
	border-radius: 12px;
	background-color: var(--theme-bg-color);
	box-shadow: 0px 0px 4px 0px #2626262b;
`

export const UserContainer = styled.div`
	width: 400px;
	padding: 20px 30px;
	border-radius: 12px;
	background-color: var(--theme-bg-color);
	box-shadow: 0px 0px 4px 0px #2626262b;
`

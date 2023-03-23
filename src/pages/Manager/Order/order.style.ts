import styled from 'styled-components'

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: 14px;
	flex-grow: 1;
	justify-content: center;
	align-items: center;
	flex-wrap: wrap;
`

export const Hidden = styled.div`
	overflow: hidden;
	height: 0;
`

export const Row = styled.div`
	display: flex;
	gap: 16px;
	width: 100%;
	max-width: 1720px;

	@media screen and (max-width: 980px) {
		flex-wrap: wrap;
	}
`

export const OrderList = styled.div`
	/* max-width: 800px; */
	width: 100%;
	flex-shrink: 2;
	padding: 20px 30px;
	border-radius: 12px;
	background-color: var(--theme-bg-color);
	box-shadow: 0px 0px 4px 0px #2626262b;
`

export const UserContainer = styled.div`
	/* max-width: 400px; */
	width: 100%;
	flex-shrink: 3;
	padding: 20px 30px;
	border-radius: 12px;
	background-color: var(--theme-bg-color);
	box-shadow: 0px 0px 4px 0px #2626262b;

	@media screen and (max-width: 980px) {
		order: -1;
	}
`

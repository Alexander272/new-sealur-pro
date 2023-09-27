// import styled from 'styled-components'
import styled from '@emotion/styled'

export const Container = styled.div`
	max-width: 1580px;
	/* padding: 50px 10px; */
	flex-grow: 1;
	/* display: flex; */
	/* flex-direction: column; */
	/* justify-content: center; */
	/* align-items: flex-start; */
	flex-wrap: wrap;
	gap: 14px;
	margin: 10px auto;
	width: 100%;
	min-height: 300px;
`

export const OrderItem = styled.div`
	padding: 10px 16px;
	border-radius: 12px;
	background-color: var(--theme-bg-color);
	box-shadow: 0px 0px 4px 0px #2626262b;
	flex-basis: 32%;
	max-width: 450px;
	min-width: 290px;
	position: relative;
	display: flex;
	flex-direction: column;

	@media screen and (max-width: 940px) {
		flex-basis: 47%;
	}
	@media screen and (max-width: 600px) {
		flex-basis: 100%;
	}
`

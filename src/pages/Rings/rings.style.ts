// import styled from 'styled-components'
import styled from '@emotion/styled'

export const Container = styled.div`
	max-width: 1580px;
	/* padding: 50px 10px; */
	align-self: center;
	/* flex-grow: 1; */
	display: flex;
	flex-direction: column;
	justify-content: center;
	margin: 0 auto;
	width: 100%;
	align-self: flex-start;
`

export const Content = styled.div`
	/* flex-grow: 1; */
	margin: 10px 0;
	position: relative;

	display: grid;
	grid-column-gap: 16px;
	grid-row-gap: 16px;
	grid-template-columns: repeat(12, 1fr);
	/* grid-template-rows: 1fr; */
`

export const PageTitle = styled.h3`
	/* grid-column-start: 1;
	grid-column-end: 12;
	grid-row-start: 1;
	grid-row-end: 2; */
	margin: 5px;
	text-align: center;
	margin-top: -30px;
	/* margin-left: 5px; */

	@media screen and (max-width: 1000px) {
		margin-top: 10px;
	}
`

// export const Box = styled.div``

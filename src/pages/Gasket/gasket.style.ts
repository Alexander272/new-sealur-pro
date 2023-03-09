import styled from 'styled-components'

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
`

export const Content = styled.div`
	/* flex-grow: 1; */
	margin: 10px 0;
	position: relative;

	display: grid;
	grid-column-gap: 16px;
	grid-row-gap: 16px;
	grid-template-columns: repeat(12, 1fr);
`

export const PageTitle = styled.h3`
	grid-column-start: 1;
	grid-column-end: 12;
	grid-row-start: 1;
	grid-row-end: 2;
	margin: 5px;
	/* margin-left: 5px; */
`

const BaseContainer = styled.div`
	padding: 20px 30px;
	border-radius: 12px;
	background-color: var(--theme-bg-color);
	box-shadow: 0px 0px 4px 0px #2626262b;
`

export const MainContainer = styled(BaseContainer)`
	grid-column-start: 1;
	grid-column-end: 8;
	grid-row-start: 1;
	grid-row-end: 2;
	display: flex;
	gap: 10px;

	@media screen and (max-width: 1150px) {
		grid-column-end: 12;
	}
`

export const SizeContainer = styled(BaseContainer)`
	grid-column-start: 1;
	grid-column-end: 8;
	grid-row-start: 2;
	grid-row-end: 3;
	display: flex;
	gap: 10px;

	@media screen and (max-width: 1150px) {
		grid-column-end: 12;
	}
`

export const ResultContainer = styled(BaseContainer)`
	grid-column-start: 1;
	grid-column-end: 13;
`

export const AsideContainer = styled(BaseContainer)`
	grid-column-end: 13;
	grid-column-start: 8;
	/* grid-row-end: 2;
	grid-row-start: 1; */

	@media screen and (max-width: 1150px) {
		grid-column-start: 1;
	}
`

type ColumnProps = {
	width?: number
}
export const Column = styled.div<ColumnProps>`
	display: flex;
	width: ${props => (props.width ? props.width + '%' : '50%')};
	flex-direction: column;
	gap: 6px;
`

export const PlugImage = styled.div`
	display: flex;
	background-color: var(--secondary-color);
	flex-grow: 1;
	border-radius: 12px;
`

export const ImageContainer = styled.div`
	position: relative;
	margin: auto 0;
	padding: 20px 0;
`

export const Image = styled.img`
	width: 100%;
`

// export const Description = styled.p`
// 	text-align: justify;
// 	margin-bottom: 15px;
// 	user-select: none;
// `

// export const Designation = styled.p`
// 	margin-bottom: 10px;
// 	font-size: 1.12rem;
// 	user-select: none;
// `

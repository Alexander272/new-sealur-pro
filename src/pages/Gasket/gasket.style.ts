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

type ContainerProps = {
	rowStart?: number
	rowEnd?: number
}
const BaseContainer = styled.div<ContainerProps>`
	padding: 20px 30px;
	border-radius: 12px;
	background-color: var(--theme-bg-color);
	box-shadow: 0px 0px 4px 0px #2626262b;
	position: relative;
`

export const MainContainer = styled(BaseContainer)`
	grid-column-start: 1;
	grid-column-end: 8;
	grid-row-start: ${props => props.rowStart || '1'};
	grid-row-end: ${props => props.rowEnd || '2'};
	display: flex;
	gap: 10px;

	@media screen and (max-width: 1150px) {
		grid-column-end: 13;
	}
	@media screen and (max-width: 700px) {
		flex-wrap: wrap;
	}
`

export const SizeContainer = styled(BaseContainer)`
	grid-column-start: 1;
	grid-column-end: 8;
	grid-row-start: ${props => props.rowStart || '2'};
	grid-row-end: ${props => props.rowEnd || '3'};
	display: flex;
	gap: 10px;
	min-height: 100px;

	@media screen and (max-width: 1150px) {
		grid-column-end: 13;
	}
	@media screen and (max-width: 700px) {
		flex-wrap: wrap;
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
	grid-row-start: ${props => props.rowStart || 'auto'};
	grid-row-end: ${props => props.rowEnd || 'auto'};

	@media screen and (max-width: 1150px) {
		grid-column-start: 1;
		grid-row-start: auto;
		grid-row-end: auto;
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
	position: relative;

	@media screen and (max-width: 700px) {
		width: 100%;
	}
`

export const PlugImage = styled.div`
	display: flex;
	background-color: var(--secondary-color);
	flex-grow: 1;
	border-radius: 12px;
`

export const ImageContainer = styled.div`
	position: relative;
	margin: auto;
	padding: 20px 0;
	width: fit-content;
	/* width: 100%;
	height: 100%; */
`

type ImageProps = {
	maxWidth?: string
	position?: string
	top?: string
	left?: string
	padding?: string
	isHidden?: boolean
}
export const Image = styled.img<ImageProps>`
	width: 100%;
	/* width: auto; */
	height: auto;
	margin: auto;
	max-height: 100%;
	max-width: ${props => (props.maxWidth ? props.maxWidth : '100%')};
	padding: ${props => props.padding && props.padding};
	position: ${props => (props.position ? props.position : 'relative')};
	top: ${props => props.top && props.top};
	left: ${props => props.left && props.left};
	visibility: ${props => props.isHidden && 'hidden'};
`

export const CompositeImage = styled.div`
	/* position: absolute;
	max-width: 500px;
	width: 100%;
	height: 100%; */
	position: relative;
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

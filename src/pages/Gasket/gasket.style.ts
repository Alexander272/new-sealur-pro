import styled from 'styled-components'

export const Container = styled.div`
	width: 1580px;
	padding: 50px 10px;
	align-self: center;
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
`

export const Content = styled.div`
	flex-grow: 1;
	margin: 20px 0;
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
	margin-left: 5px;
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
	display: flex;
	gap: 10px;
`

export const SizeContainer = styled(BaseContainer)``

export const ResultContainer = styled(BaseContainer)``

type ColumnProps = {
	width?: number
}
export const Column = styled.div<ColumnProps>`
	display: flex;
	flex-basis: ${props => (props.width ? props.width + '%' : '50%')};
	flex-direction: column;
	gap: 6px;
`

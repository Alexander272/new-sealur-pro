import styled from 'styled-components'

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: 14px;
	flex-grow: 1;
	justify-content: center;
	align-items: center;
	flex-wrap: wrap;
	margin-bottom: 40px;
`

export const BaseInfo = styled.div`
	width: 100%;
	max-width: 600px;
	padding: 20px 30px;
	border-radius: 12px;
	background-color: var(--theme-bg-color);
	box-shadow: 0px 0px 4px 0px #2626262b;
	margin-bottom: 20px;
`

export const Period = styled.div`
	width: 100%;
	max-width: 600px;
	display: flex;
`

export const Info = styled.div`
	width: 100%;
	max-width: 1200px;
	padding: 20px 30px;
	border-radius: 12px;
	background-color: var(--theme-bg-color);
	box-shadow: 0px 0px 4px 0px #2626262b;
	margin-bottom: 20px;
`

export const Question = styled.span`
	border-radius: 50%;
	line-height: 14px;
	border: 1px dotted var(--primary-color);
	color: var(--primary-color);
	display: inline-block;
	width: 14px;
	vertical-align: super;
	font-size: 10px;
	cursor: pointer;
	text-align: center;
`

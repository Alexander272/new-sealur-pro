import styled from 'styled-components'

export const Container = styled.div`
	max-width: 1580px;
	/* padding: 50px 10px; */
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	/* justify-content: center; */
	/* align-items: center; */
	flex-wrap: wrap;
	gap: 10px;
	margin: 10px auto;
	width: 100%;
	min-height: 300px;
`

export const Links = styled.div`
	padding: 20px 30px;
	border-radius: 12px;
	background-color: var(--theme-bg-color);
	box-shadow: 0px 0px 4px 0px #2626262b;
	margin: auto;
	margin-bottom: 5px;
	width: 100%;
	max-width: 600px;
`

export const LinksLine = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-wrap: wrap;
	gap: 12px;
	margin-top: 10px;
`

export const Link = styled.a`
	text-decoration: none;
	display: flex;
	align-items: center;
	padding: 6px 12px;
	border-radius: 40px;
	background-color: #0088cc;
	color: white;
`

export const Form = styled.form`
	padding: 20px 30px;
	border-radius: 12px;
	background-color: var(--theme-bg-color);
	box-shadow: 0px 0px 4px 0px #2626262b;
	margin: auto;
	margin-top: 5px;
	display: flex;
	flex-direction: column;
	gap: 14px;
	width: 100%;
	max-width: 600px;
`

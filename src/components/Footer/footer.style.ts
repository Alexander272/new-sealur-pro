import { Link } from 'react-router-dom'
// import styled from 'styled-components'
import styled from '@emotion/styled'

export const Container = styled.footer`
	text-align: center;
	display: flex;
	justify-content: center;
	padding-top: 20px;
	padding-bottom: 10px;
	user-select: none;
`
export const FileLink = styled.a`
	text-decoration: none;
	color: black;
	transition: all 0.3s ease-in-out;
	font-size: 14px;

	&:hover {
		color: var(--primary-color);
	}
`

export const NavLink = styled(Link)`
	text-decoration: none;
	color: black;
	transition: all 0.3s ease-in-out;
	display: flex;
	align-items: center;
	font-size: 14px;

	&:hover {
		color: var(--primary-color);
	}
`

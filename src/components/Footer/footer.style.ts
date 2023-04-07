import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const Container = styled.footer`
	text-align: center;
	display: flex;
	justify-content: center;
	padding-top: 20px;
	padding-bottom: 10px;
`
export const FileLink = styled.a`
	text-decoration: none;
	color: black;
	transition: all 0.3s ease-in-out;

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

	&:hover {
		color: var(--primary-color);
	}
`

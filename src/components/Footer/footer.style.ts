import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const Container = styled.footer`
	text-align: center;
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

	&:hover {
		color: var(--primary-color);
	}
`

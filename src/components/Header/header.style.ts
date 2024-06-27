import { Link } from 'react-router-dom'
// import styled from 'styled-components'
import styled from '@emotion/styled'

export const Container = styled.header`
	width: 100%;
	background: #fff;
	box-shadow: 0 0 3px #0000004f;
	margin-bottom: 20px;
	user-select: none;
`

export const Content = styled.div`
	display: flex;
	padding: 9px 10px;
	max-width: 1580px;
	margin: 0 auto;
	flex-wrap: wrap;
	gap: 10px;
`

export const Logo = styled.img`
	width: auto;
	height: 46px;
`

export const LogoLink = styled(Link)`
	text-decoration: none;
	display: flex;
	align-items: center;
	color: var(--primary-color);
	font-size: 2.4rem;

	span {
		margin-left: 3px;
	}

	@media screen and (max-width: 500px) {
		flex-basis: 100%;
		justify-content: center;
		margin-bottom: 10px;
	}
`

export const Nav = styled.nav`
	margin-left: auto;
	display: flex;
	align-items: center;
	justify-content: center;

	@media screen and (max-width: 500px) {
		flex-basis: 100%;
		margin-bottom: 10px;
	}
`

export const BarLink = styled.a`
	height: 28px;
`

export const NavLink = styled(Link)`
	height: 20px;
	width: 32px;
`

export const Icon = styled.div`
	margin-right: 20px;
	height: 100%;
	width: 32px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	position: relative;
`

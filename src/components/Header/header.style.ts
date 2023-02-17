import { Link } from 'react-router-dom'
import styled from 'styled-components'

// export const HeaderContainer = styled.header`
// 	height: 40px;
// 	margin-bottom: 20px;
// 	display: flex;
// 	align-items: center;
// 	max-width: 1400px;
// 	width: 100%;
// 	padding: 0 10px;
// `

export const Container = styled.header`
	width: 100%;
	// height: 80px;
	background: #fff;
	box-shadow: 0 0 3px #0000004f;
	margin-bottom: 20px;
`

export const Content = styled.div`
	display: flex;
	padding: 5px 10px;
	max-width: 1580px;
	margin: 0 auto;
`

export const Logo = styled.img`
	width: auto;
	height: 65px;
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
`

export const Nav = styled.nav`
	margin-left: auto;
	display: flex;
	align-items: center;
	justify-content: center;
`

export const BarLink = styled(Link)`
	height: 100%;
	width: 32px;
`

// .profile {
//     margin-left: 20px;
//     height: 100%;
//     width: 32px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     cursor: pointer;
//     position: relative;
// }

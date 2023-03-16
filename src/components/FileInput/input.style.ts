import styled from 'styled-components'

export const Field = styled.div`
	position: relative;
	display: flex;
	justify-content: space-between;
	align-items: center;
`

export const Input = styled.input`
	width: 0.1px;
	height: 0.1px;
	opacity: 0;
	overflow: hidden;
	position: absolute;
	z-index: -1;
`

export const Label = styled.label`
	font-family: var(--body-font);
	letter-spacing: 1px;
	flex-grow: 1;
	max-width: 290px;
	border-radius: 12px;
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0;
	max-width: 300px;
	padding: 6px 30px;
	outline: none;
	transition: all 0.3s ease-in-out;
	color: #000;
	border: 2px solid rgba(7, 55, 177, 0.5);

	&:hover {
		border-color: rgba(7, 55, 177, 1);
	}

	/* &.danger {
		margin-left: 10px;
		border: 2px solid rgba(237, 17, 17, 0.5);

		&:hover {
			border-color: rgb(237, 17, 17);
		}
	} */
`

export const Icon = styled.span`
	width: 22px;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-right: 5px;
`

export const IconImage = styled.img``

export const Link = styled.a`
	font-family: var(--body-font);
	letter-spacing: 1px;
	flex-grow: 1;
	max-width: 290px;
	border-radius: 12px;
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0;
	max-width: 300px;
	padding: 6px 30px;
	outline: none;
	transition: all 0.3s ease-in-out;
	color: #000;
	border: 2px solid rgba(7, 55, 177, 0.5);

	&:hover {
		border-color: rgba(7, 55, 177, 1);
	}
`

export const Danger = styled.p`
	font-family: var(--body-font);
	letter-spacing: 1px;
	flex-grow: 1;
	max-width: 290px;
	border-radius: 12px;
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0;
	max-width: 300px;
	padding: 6px 30px;
	outline: none;
	transition: all 0.3s ease-in-out;
	color: #000;
	margin-left: 10px;
	border: 2px solid rgba(237, 17, 17, 0.5);

	&:hover {
		border-color: rgb(237, 17, 17);
	}
`

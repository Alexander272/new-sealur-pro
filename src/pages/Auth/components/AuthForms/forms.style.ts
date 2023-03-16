import styled from 'styled-components'
import { TextField } from '@mui/material'
import { styled as UIStyled } from '@mui/material/styles'

type FormProps = {
	open?: boolean
}
export const Title = styled.h2<FormProps>`
	margin: 0;
	border-bottom: ${props => (props.open ? '1px solid var(--border-white)' : 'none')};
	text-align: center;
	padding-bottom: 10px;
	margin-bottom: ${props => (props.open ? '10px' : '0')};
	font-weight: 500;
	letter-spacing: 1.2px;
	color: var(--primary-color);
	transition: all 0.5s ease-in-out;
	font-weight: 700;
	font-size: ${props => (props.open ? '1.5rem' : '1.2rem')};
`

export const FormContent = styled.div`
	overflow: hidden;
	display: flex;
	flex-direction: column;
	margin: 10px 0;
`

export const Form = styled.form<FormProps>`
	padding: ${props => (props.open ? '20px 30px' : '10px 30px')};
	transition: all 0.5s ease-in-out;
	cursor: ${props => (props.open ? 'default' : 'pointer')};
`

export const SignInForm = styled(Form)``

export const SignUpForm = styled(Form)`
	background-color: var(--button-bg-color);
	border-radius: 60%/10%;
	padding-bottom: 70px;
	transform: ${props => (props.open ? 'translateY(-220px)' : 'translateY(5px)')};
`

export const Input = UIStyled(TextField)(({ theme }) => ({
	'& .MuiOutlinedInput-root': {
		// padding: '0px 6px',
		backgroundColor: '#fff',
		borderRadius: '20px',

		'& fieldset': {
			borderRadius: '20px',
			borderColor: 'var(--border-color)',
			borderWidth: '2px',
		},
		'&:hover fieldset': {
			borderColor: 'var(--light-blue)',
		},
		'&.Mui-focused fieldset': {
			borderColor: 'var(--primary-color)',
		},
	},
}))

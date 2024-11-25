import { TextField } from '@mui/material'
import { styled } from '@mui/material/styles'

export const Input = styled(TextField)(() => ({
	'& .MuiOutlinedInput-root': {
		'& fieldset': {
			borderRadius: '12px',
		},
		'&:hover fieldset': {
			// borderColor: 'var(--light-blue)',
		},
		'&.Mui-focused fieldset': {
			borderColor: 'var(--primary-color)',
		},
	},
}))

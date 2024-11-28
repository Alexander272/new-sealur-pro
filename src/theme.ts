import { createTheme } from '@mui/material/styles'
import { red } from '@mui/material/colors'

// A custom theme for this app
const theme = createTheme({
	palette: {
		primary: {
			main: '#062e93',
		},
		secondary: {
			main: '#556cd6',
		},
		error: {
			main: red.A400,
		},
	},
	typography: {
		fontFamily: ['NunitoSans', 'sans-serif'].join(','),
	},
	components: {
		MuiTooltip: {
			styleOverrides: {
				tooltip: {
					fontSize: '1rem',
					backgroundColor: '#000000de',
				},
				arrow: {
					color: '#000000de',
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					borderRadius: 8,
				},
			},
		},
		MuiSelect: {
			defaultProps: {
				size: 'small',
			},
			styleOverrides: {
				root: {
					borderRadius: 12,
				},
			},
		},
		MuiInputLabel: {
			defaultProps: {
				size: 'small',
			},
		},
		MuiTextField: {
			defaultProps: {
				size: 'small',
				autoComplete: 'off',
				onWheel: event => (event.target as HTMLInputElement).blur(),
			},
			styleOverrides: {
				root: {
					// borderRadius: 12,
					'& fieldset': {
						transition: 'all 0.3s ease-in-out',
					},
				},
			},
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: {
					borderRadius: 12,
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: 12,
				},
			},
		},
	},
})

export default theme

import { createTheme } from '@mui/material/styles'
import { red } from '@mui/material/colors'

import { type IScrollbarParameters, generateScrollbarStyles } from '@/utils/generateScrollbarStyles'

const scrollbarParameters: IScrollbarParameters = {
	borderRadius: '5px',
	scrollbarBgColor: '#f2f2f2',
	scrollbarHeight: '.5rem',
	scrollbarWidth: '.5rem',
	thumbColor: '#00000020',
	thumbColorActive: '#00000050',
	thumbColorHover: '#00000030',
}

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
		MuiCssBaseline: {
			styleOverrides: generateScrollbarStyles(scrollbarParameters),
		},
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
					'& fieldset': {
						transition: 'all 0.3s ease-in-out',
					},
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

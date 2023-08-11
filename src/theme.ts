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
		fontFamily: ['NunitoSans', 'Merriweather', 'sans-serif'].join(','),
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
	},
})

export default theme

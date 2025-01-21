import { CssBaseline, ThemeProvider } from '@mui/material'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.min.css'

import { AppRouter } from '@/router/AppRouter'
import { store } from './app/store'
import theme from './theme'
import './index.css'

function App() {
	return (
		<Provider store={store}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<AppRouter />
			</ThemeProvider>
			<ToastContainer />
		</Provider>
	)
}

export default App

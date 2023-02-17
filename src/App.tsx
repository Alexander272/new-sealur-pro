import { ChakraProvider } from '@chakra-ui/react'
import { Provider } from 'react-redux'
import { AppRoutes } from '@/routes'
import { store } from '@/store/store'

function App() {
	return (
		<Provider store={store}>
			<ChakraProvider>
				<AppRoutes />
			</ChakraProvider>
		</Provider>
	)
}

export default App

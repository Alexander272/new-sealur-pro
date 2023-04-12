import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
	},
	server: {
		proxy: {
			'/api': 'http://localhost:8080',
		},
	},
	build: {
		target: 'es2015',
	},
})

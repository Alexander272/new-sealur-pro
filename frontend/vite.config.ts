import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react({
			plugins: [['@swc/plugin-emotion', {}]],
		}),
		VitePWA({
			registerType: 'autoUpdate',
			manifest: {
				id: 'pro',
				name: 'SealurPro',
				short_name: 'SealurPro',
				description:
					'Сервис по подбору и заказу спирально-навитых прокладок (СНП), прокладок из терморасширенного графита (ПУТГ), прокладок на металлическом волновом или зубчатом основании',
				lang: 'ru',
				theme_color: '#fafafa',
				background_color: '#fafafa',
				icons: [
					{
						src: 'favicon.ico',
						type: 'image/x-icon',
						sizes: '100x97',
					},
					{
						src: 'logo192.webp',
						type: 'image/webp',
						sizes: '192x192',
					},
				],
			},
		}),
	],
	resolve: {
		alias: [
			{
				find: '@',
				replacement: path.resolve(__dirname, 'src'),
			},
		],
	},
	server: {
		proxy: {
			'/api': 'http://localhost:8080',
		},
	},
	build: {
		target: 'es2021',
	},
})

import { Box, Typography } from '@mui/material'
import { GasketRoute, PutgRoute, RingRoute, RingsRoute, SnpRoute } from '@/routes'
import { List } from './components/List'

export type ListItem = {
	title: string
	route: string
	children?: ListItem[]
}

const list: ListItem[] = [
	{
		title: 'Фланцевые прокладки',
		route: GasketRoute,
		children: [
			{ title: 'Спирально-навитая прокладка (СНП)', route: SnpRoute },
			{ title: 'Графитовая прокладка ПУТГ', route: PutgRoute },
		],
	},
	{
		title: 'Сальниковые кольца и комплекты',
		route: RingsRoute,
		children: [{ title: 'Кольца', route: RingRoute }],
	},
]

export default function Home() {
	return (
		<Box display={'flex'} justifyContent={'center'} ml={'auto'} mr={'auto'}>
			<Box>
				<Typography fontWeight={'bold'} fontSize={'1.2rem'} textAlign={'center'}>
					Продукция
				</Typography>

				{list.map(l => (
					<List key={l.route} list={l} />
				))}
			</Box>
		</Box>
	)
}

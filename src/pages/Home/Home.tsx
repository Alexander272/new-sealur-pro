import { Box, Divider, Typography } from '@mui/material'
import { GasketRoute, PutgRoute, RingRoute, RingsKitRoute, RingsRoute, SnpRoute } from '@/routes'
import { List } from './components/List'

export type ListItem = {
	title: string
	route: string
	children?: ListItem[]
}

//TODO у меня два списка создаются на основе похожих данных. надо их обЪединить и положить в одно место
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
		children: [
			{ title: 'Кольца', route: RingRoute },
			{ title: 'Комплекты колец', route: RingsKitRoute },
		],
	},
]

export default function Home() {
	return (
		<Box display={'flex'} justifyContent={'center'} ml={'auto'} mr={'auto'}>
			<Box>
				<Typography fontWeight={'bold'} fontSize={'1.2rem'} textAlign={'center'} color={'primary'}>
					Продукция
				</Typography>
				<Divider
					sx={{
						width: '40%',
						border: '1px solid var(--primary-color)',
						marginBottom: 2,
						marginLeft: '30%',
						marginRight: '30%',
						// ml: 'auto',
						// mr: 'auto',
					}}
				/>

				{list.map(l => (
					<List key={l.route} list={l} />
				))}
			</Box>
		</Box>
	)
}

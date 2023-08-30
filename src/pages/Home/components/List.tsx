import { FC } from 'react'
import { Box, Typography } from '@mui/material'
import type { ListItem } from '../Home'
import { ListLink } from '../home.style'

type Props = {
	list: ListItem
}

export const List: FC<Props> = ({ list }) => {
	return (
		<>
			<ListLink to={list.route}>
				<Box
					// overflow={'hidden'}
					// position={'relative'}
					display={'flex'}
					// padding={1}
					padding={'8px 16px'}
					borderRadius={'12px'}
					sx={{ transition: 'all .3s ease-in-out', ':hover': { backgroundColor: '#062e9314' } }}
				>
					{/* <Box
						position={'absolute'}
						left={0}
						top={0}
						width={6}
						height={'100%'}
						sx={{ background: 'var(--primary-color)' }}
					/> */}

					<Typography fontWeight={'bold'} ml={2}>
						{list.title}
					</Typography>
				</Box>
			</ListLink>

			{list.children && (
				<Box ml={3}>
					{list.children.map(l => (
						<ItemList key={l.route} list={l} />
					))}
				</Box>
			)}
		</>
	)
}

export const ItemList: FC<Props> = ({ list }) => {
	return (
		<ListLink to={list.route}>
			<Box
				// overflow={'hidden'}
				// position={'relative'}
				display={'flex'}
				padding={'8px 16px'}
				borderRadius={'12px'}
				sx={{ transition: 'all .3s ease-in-out', ':hover': { backgroundColor: '#062e9314' } }}
			>
				<Typography ml={2}>{list.title}</Typography>
			</Box>
		</ListLink>
	)
}

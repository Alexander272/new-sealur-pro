import { FC } from 'react'
import { Box, Divider, Typography } from '@mui/material'
import ArrowIcon from '@mui/icons-material/ArrowForwardIosOutlined'
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
					alignItems={'center'}
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

					<Typography fontWeight={'bold'} ml={2} color={'primary'}>
						{list.title}
					</Typography>
					<Box ml={'auto'} display={'flex'}>
						<ArrowIcon sx={{ marginLeft: 2, fontSize: '18px', color: 'var(--primary-color)' }} />
					</Box>
				</Box>
				<Divider
					sx={{
						width: '20%',
						border: '1px solid var(--primary-color)',
						marginBottom: 1,
						marginLeft: '8%',
					}}
				/>
			</ListLink>

			{list.children && (
				<Box mb={2}>
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
				alignItems={'center'}
				padding={'8px 16px'}
				borderRadius={'12px'}
				pl={3}
				sx={{ transition: 'all .3s ease-in-out', ':hover': { backgroundColor: '#062e9314' } }}
			>
				{/* <Box
					width={24}
					sx={{
						backgroundImage:
							'-webkit-repeating-radial-gradient(center center, var(--primary-color), rgba(0,0,0,.2) 1px, transparent 1px, transparent 100%)',
						backgroundSize: '3px 3px',
						borderRadius: '8px',
					}}
				/> */}
				<Typography ml={3}>{list.title}</Typography>
				<Box ml={'auto'} display={'flex'}>
					<ArrowIcon sx={{ marginLeft: 2, fontSize: '18px' }} />
				</Box>
			</Box>
		</ListLink>
	)
}

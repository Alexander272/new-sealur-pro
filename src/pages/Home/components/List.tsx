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
					overflow={'hidden'}
					position={'relative'}
					display={'flex'}
					paddingTop={1}
					paddingBottom={1}
					borderRadius={'12px'}
				>
					{/* <Box
						position={'absolute'}
						left={0}
						top={0}
						width={6}
						height={'100%'}
						sx={{ background: 'var(--primary-color)' }}
					/> */}

					<Typography ml={2}>{list.title}</Typography>
				</Box>
			</ListLink>

			{list.children && (
				<Box ml={3}>
					{list.children.map(l => (
						<List key={l.route} list={l} />
					))}
				</Box>
			)}
		</>
	)
}

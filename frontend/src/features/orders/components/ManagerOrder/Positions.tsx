import { FC } from 'react'
import {
	Divider,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material'

import type { IFullOrder } from '../../types/order'

type Props = {
	data: IFullOrder
}

export const Positions: FC<Props> = ({ data }) => {
	return (
		<Stack
			sx={{
				position: 'relative',
				background: '#fff',
				borderRadius: 3,
				pt: 1,
				pb: 2,
				px: 2,
				boxShadow: '0px 0px 4px 0px #2626262b;',
				width: '100%',
				flexShrink: 1,
			}}
		>
			{data?.info && (
				<>
					<Typography variant='h6' align='center'>
						Дополнительная информация
					</Typography>
					<Typography>{data.info}</Typography>
					<Divider sx={{ width: '50%', marginX: 'auto', mt: 1, mb: 2 }} />
				</>
			)}

			<TableContainer sx={{ maxHeight: 650 }}>
				<Table stickyHeader>
					<TableHead>
						<TableRow>
							<TableCell width={50}>№</TableCell>
							<TableCell>Наименование</TableCell>
							<TableCell width={170}>Количество</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data?.positions?.map((p, idx) => (
							<TableRow key={p.id}>
								<TableCell>{idx + 1}</TableCell>
								<TableCell>{p.title}</TableCell>
								<TableCell align='center'>{p.amount}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	)
}

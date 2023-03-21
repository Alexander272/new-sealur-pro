import { FC } from 'react'
import { IconButton, Table, TableBody, TableCell, TableRow, Tooltip } from '@mui/material'
import { IFullOrder } from '@/types/order'

type Props = {
	order: IFullOrder | null
	onCopy: (id: string) => void
}

export const FullPositionTable: FC<Props> = ({ order, onCopy }) => {
	const copyHandler = (id: string) => () => {
		onCopy(id)
	}

	if (!order) return null

	return (
		<Table size='small'>
			<TableBody>
				{order.positions?.map((p, i) => (
					<TableRow key={p.id}>
						<TableCell>{p.count}</TableCell>
						<TableCell>{p.title}</TableCell>
						<TableCell>{p.amount} шт.</TableCell>
						<TableCell width={32}>
							<Tooltip title='Добавить в текущую заявку'>
								<IconButton onClick={copyHandler(p.id)} size='small'>
									➜
								</IconButton>
							</Tooltip>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}

import { FC } from 'react'
import { IconButton, Table, TableBody, TableCell, TableRow, Tooltip } from '@mui/material'
import { IFullOrder } from '@/types/order'

type Props = {
	order: IFullOrder
	onCopy: (id: string) => void
}

export const PositionTable: FC<Props> = ({ order, onCopy }) => {
	const copyHandler = (id: string) => () => {
		onCopy(id)
	}

	return (
		<Table size='small'>
			<TableBody>
				{order.positions?.map((p, i) => {
					if (order.positions?.length == 6 || i < 5) {
						return (
							<TableRow key={p.id}>
								<TableCell>{p.title}</TableCell>
								<TableCell width={32}>
									<Tooltip title='Добавить в текущую заявку'>
										<IconButton onClick={copyHandler(p.id)} size='small'>
											➜
										</IconButton>
									</Tooltip>
								</TableCell>
							</TableRow>
						)
					} else return null
				})}
				{(order.positions?.length || 0) > 6 && (
					<TableRow>
						<TableCell align='center' colSpan={2}>
							{/* <Button fullWidth endIcon={<>»</>}>
								Подробнее
							</Button> */}
							...
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	)
}

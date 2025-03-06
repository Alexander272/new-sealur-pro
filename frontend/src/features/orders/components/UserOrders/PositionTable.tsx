import { FC } from 'react'
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material'
import { toast } from 'react-toastify'

import type { IFetchError } from '@/app/types/error'
import type { ICopyPosition, Position } from '@/features/card/types/card'
import { useAppSelector } from '@/hooks/redux'
import { useCopyPositionMutation } from '@/features/card/cardApiSlice'
import { getOrderId, getPositions } from '@/features/card/cardSlice'
import { TopFallback } from '@/components/Fallback/TopFallback'

type Props = {
	data: Position[]
}

export const PositionTable: FC<Props> = ({ data }) => {
	const orderId = useAppSelector(getOrderId)
	const positions = useAppSelector(getPositions)

	const [copy, { isLoading }] = useCopyPositionMutation()

	//TODO можно получать количество из формы через поле context
	// const modal = useAppSelector(getDialogState('Employee'))
	// dispatch(changeDialogIsOpen({ variant: 'Employee', isOpen: true, content: { id, department } }))
	// тогда надо еще как-то вызывать функцию для копирования

	const copyHandler = (data: Position) => async () => {
		const newData: ICopyPosition = {
			id: data.id,
			count: positions.length > 0 ? positions[positions.length - 1].count + 1 : 1,
			amount: data.amount,
			orderId: orderId,
			fromOrderId: data.orderId,
		}

		try {
			await copy(newData).unwrap()
			toast.success('Позиция добавлена в заявку')
		} catch (error) {
			const fetchError = error as IFetchError
			toast.error(fetchError.data.message, { autoClose: false })
		}
	}

	return (
		<TableContainer>
			{isLoading && <TopFallback />}

			<Table size='small' aria-label='purchases'>
				<TableHead>
					<TableRow>
						<TableCell component='th' scope='row' width={50}>
							№
						</TableCell>
						<TableCell width={'75%'}>Наименование</TableCell>
						<TableCell>Количество</TableCell>
						<TableCell width={32} />
					</TableRow>
				</TableHead>

				<TableBody>
					{data?.map((p, i) => (
						<TableRow key={p.id}>
							<TableCell component='th' scope='row' width={50}>
								{i + 1}
							</TableCell>
							<TableCell width={'75%'}>{p.title}</TableCell>
							<TableCell>{p.amount} шт.</TableCell>
							<TableCell width={32}>
								<Tooltip title='Добавить в текущую заявку'>
									<IconButton onClick={copyHandler(p)} size='small'>
										➜
									</IconButton>
								</Tooltip>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}

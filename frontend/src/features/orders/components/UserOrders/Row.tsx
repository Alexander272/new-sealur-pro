import { FC, useState } from 'react'
import { Box, Collapse, IconButton, TableCell, TableRow, Tooltip, Typography } from '@mui/material'
import { toast } from 'react-toastify'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'

import type { ICopyPosition } from '@/features/card/types/card'
import type { IFullOrder } from '../../types/order'
import { stampToDate } from '@/utils/date'
import { useAppSelector } from '@/hooks/redux'
import { getOrderId, getPositions } from '@/features/card/cardSlice'
import { TopFallback } from '@/components/Fallback/TopFallback'
import { PositionTable } from './PositionTable'
import { useCopyOrderMutation } from '../../ordersApiSlice'

type Props = {
	data: IFullOrder
	open?: boolean
}

export const Row: FC<Props> = ({ data, open: defaultOpen }) => {
	const [open, setOpen] = useState(defaultOpen || false)

	const orderId = useAppSelector(getOrderId)
	const positions = useAppSelector(getPositions)

	const [copy, { isLoading }] = useCopyOrderMutation()

	const copyHandler = async () => {
		const pos: ICopyPosition[] = []
		data.positions?.forEach((position, i) => {
			pos.push({
				id: position.id,
				count: positions.length > 0 ? positions[positions.length - 1].count + i + 1 : i + 1,
				amount: position.amount,
				orderId: orderId,
				fromOrderId: data.id,
			})
		})
		const newData = {
			id: orderId,
			positions: pos,
		}

		try {
			await copy(newData).unwrap()
			toast.success('Заказ скопирован')
		} catch {
			toast.error('Не удалось скопировать заказ')
		}
	}

	return (
		<>
			<TableRow sx={{ '& > *': { borderBottom: 'unset!important' } }}>
				<TableCell>
					<IconButton aria-label='expand row' size='small' onClick={() => setOpen(!open)}>
						<KeyboardArrowDownIcon sx={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
					</IconButton>
				</TableCell>
				<TableCell component='th' scope='row' align='center'>
					{data.number}
				</TableCell>
				<TableCell align='center'>{stampToDate(+(data.date || 0) * 1000)}</TableCell>
				<TableCell align='center'>{data.countPosition}</TableCell>
				<TableCell align='right'>
					{isLoading && <TopFallback />}
					<Tooltip title='Добавить все позиции в текущую заявку'>
						<IconButton size='small' onClick={copyHandler}>
							<KeyboardDoubleArrowRightIcon />
						</IconButton>
					</Tooltip>
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
					<Collapse in={open} timeout='auto' unmountOnExit>
						<Box sx={{ margin: 1 }}>
							<Typography variant='h6' gutterBottom component='div'>
								Позиции
							</Typography>

							<PositionTable data={data.positions || []} />
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</>
	)
}

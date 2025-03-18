import { FC, useEffect, useRef } from 'react'
import { Box, IconButton, Tooltip } from '@mui/material'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'

import type { IFullOrder } from '../../types/order'
import { DownloadIcon } from '@/components/Icons/DownloadIcon'
import { useLazyDownloadOrderQuery } from '../../ordersApiSlice'
import { OrderMenu } from '../OrderMenu/OrderMenu'

type Props = {
	data: IFullOrder
}

export const Buttons: FC<Props> = ({ data }) => {
	const anchor = useRef<HTMLButtonElement>(null)

	const location = useLocation()

	const [download] = useLazyDownloadOrderQuery()

	useEffect(() => {
		if (location.search == '?action=save' && anchor.current) anchor.current.click()
	}, [location.search])

	const downloadHandler = async () => {
		try {
			await download({ id: data.id, name: 'Заявка ' + data.number })
		} catch {
			toast.error('Не удалось скачать заявку')
		}
	}

	return (
		<Box ml={0.5}>
			<OrderMenu data={data} />

			<Tooltip title='Скачать'>
				<IconButton ref={anchor} onClick={downloadHandler} sx={{ ml: 2 }}>
					<DownloadIcon fontSize={18} />
				</IconButton>
			</Tooltip>
		</Box>
	)
}

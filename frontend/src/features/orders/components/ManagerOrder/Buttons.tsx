import { FC } from 'react'
import { Box, IconButton, Tooltip } from '@mui/material'

import type { IFullOrder } from '../../types/order'
import { OrderMenu } from '../OrderMenu/OrderMenu'
import { DownloadIcon } from '@/components/Icons/DownloadIcon'

type Props = {
	data: IFullOrder
}

export const Buttons: FC<Props> = ({ data }) => {
	return (
		<Box ml={0.5}>
			<OrderMenu data={data} />

			<Tooltip title='Скачать'>
				<IconButton sx={{ ml: 2 }}>
					<DownloadIcon fontSize={18} />
				</IconButton>
			</Tooltip>
		</Box>
	)
}

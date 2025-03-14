import { FC } from 'react'
import Box from '@mui/material/Box'

import StyledGridOverlay from './StyledGridOverlay'

import EmptyIcon from './EmptyIcon'
import { SxProps } from '@mui/material'

type Props = {
	title?: string
	sx?: SxProps
}

export const NoRowsOverlay: FC<Props> = ({ title, sx }) => {
	return (
		<StyledGridOverlay sx={sx}>
			<EmptyIcon />
			<Box mt={1} color='text.primary'>
				{title ? title : 'Не найдено ни одной позиции'}
			</Box>
		</StyledGridOverlay>
	)
}

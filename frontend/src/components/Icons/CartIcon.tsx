import { SvgIcon, SxProps, Theme } from '@mui/material'
import { FC } from 'react'

type Props = {
	sx?: SxProps<Theme>
}

export const CartIcon: FC<Props> = ({ sx }) => {
	return (
		<SvgIcon sx={sx}>
			<svg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
				<path
					fillRule='evenodd'
					clipRule='evenodd'
					d='M8.735 14.018a1 1 0 0 1 .876-.518h6.859c.75 0 1.41-.41 1.75-1.03l3.38-6.14a.99.99 0 0 0 .113-.629A1 1 0 0 0 21 4H6c-.033 0-.066.002-.098.005l-.17-.36A2 2 0 0 0 3.924 2.5H2.92a1 1 0 0 0 0 2h.225c.473 0 .904.273 1.107.7l2.828 5.963a2 2 0 0 1-.057 1.825L6.17 14.53c-.73 1.34.23 2.97 1.75 2.97h11a1 1 0 1 0 0-2H9.61a1 1 0 0 1-.876-1.482Zm8.306-3.55L19.51 6H6.847l2.061 4.356a2 2 0 0 0 1.808 1.144h4.574a2 2 0 0 0 1.75-1.032Z'
				></path>
				<path d='M7.92 18.5c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2Z'></path>
				<path d='M17.92 18.5c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2Z'></path>
			</svg>
		</SvgIcon>
	)
}

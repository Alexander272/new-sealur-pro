import { FC } from 'react'
import { SvgIcon, SxProps, Theme } from '@mui/material'

type Props = {
	fill?: string
	sx?: SxProps<Theme>
}

export const HomeIcon: FC<Props> = ({ fill, sx }) => {
	return (
		<SvgIcon sx={sx}>
			<svg
				fill='none'
				stroke={fill}
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth='2'
				viewBox='0 0 24 24'
				xmlns='http://www.w3.org/2000/svg'
			>
				<path d='M1.714 12 12 1.714 22.286 12'></path>
				<path d='M4 13.143v4.571A2.286 2.286 0 0 0 6.286 20h11.428A2.286 2.286 0 0 0 20 17.714v-4.571'></path>
			</svg>
		</SvgIcon>
	)
}

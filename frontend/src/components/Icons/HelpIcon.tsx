import { FC } from 'react'
import { SvgIcon, SxProps, Theme } from '@mui/material'

type Props = {
	sx?: SxProps<Theme>
}

export const HelpIcon: FC<Props> = ({ sx }) => {
	return (
		<>
			{/* <SvgIcon sx={sx}>
				<svg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
					<path
						fillRule='evenodd'
						clipRule='evenodd'
						d='M12.77 11.822C11.942 12.457 11 13.179 11 15h2c0-1.095.711-1.717 1.44-2.354C15.21 11.973 16 11.283 16 10c0-2.21-1.79-4-4-4s-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 .88-.58 1.324-1.23 1.822ZM13 18.5v-2h-2v2h2Z'
					></path>
					<path
						fillRule='evenodd'
						clipRule='evenodd'
						d='M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z'
					></path>
				</svg>
			</SvgIcon> */}
			<SvgIcon sx={sx}>
				<svg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
					<path d='M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10Zm0-2a8 8 0 1 0 0-16.001A8 8 0 0 0 12 20Zm-1-5h2v2h-2v-2Zm2-1.645V14h-2v-1.5a1 1 0 0 1 1-1 1.5 1.5 0 1 0-1.471-1.794l-1.962-.393A3.5 3.5 0 1 1 13 13.355Z'></path>
				</svg>
			</SvgIcon>
		</>
	)
}

import { FC } from 'react'
import { Box, Popover, Stack, Typography } from '@mui/material'
import { Image } from '@/pages/Gasket/gasket.style'

type Props = {
	open: boolean
	anchor: HTMLElement | null
	image?: string
	imageMaxWidth?: number
	description?: string
	hasIndent?: boolean
}

export const RingTooltip: FC<Props> = ({ open, anchor, image, imageMaxWidth, description, hasIndent }) => {
	if (anchor == null) return null

	return (
		<Popover
			open={open}
			anchorEl={anchor}
			anchorOrigin={{
				vertical: 'center',
				horizontal: 'right',
			}}
			transformOrigin={{
				vertical: 'center',
				horizontal: 'left',
			}}
			slotProps={{
				paper: {
					elevation: 0,
					sx: {
						overflow: 'visible',
						filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
						'&:before': {
							content: '""',
							display: 'block',
							position: 'absolute',
							top: '50%',
							left: 0,
							width: 10,
							height: 10,
							bgcolor: 'background.paper',
							transform: 'translate(-50%, -50%) rotate(45deg)',
							zIndex: 0,
						},
					},
				},
			}}
			disableRestoreFocus
			sx={{ pointerEvents: 'none' }}
		>
			<Stack direction={'row'} spacing={2} margin={2} maxWidth={500} alignItems={'center'}>
				{image && (
					<Box display={'flex'} maxWidth={imageMaxWidth || 80} width={'100%'}>
						<Image src={image} />
					</Box>
				)}
				{description && (
					<Stack spacing={1}>
						{description.split('\\n').map((d, i) => (
							<Typography key={i} align='justify' sx={{ textIndent: hasIndent ? '12px' : 0 }}>
								{d}
							</Typography>
						))}
					</Stack>
				)}
			</Stack>
		</Popover>
	)
}

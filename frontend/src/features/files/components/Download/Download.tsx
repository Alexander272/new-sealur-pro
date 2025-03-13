import { FC } from 'react'
import { Box, Button, CircularProgress, Typography } from '@mui/material'

import type { IDrawing } from '@/features/gaskets/types/drawing'
import { useLazyDownloadFileQuery } from '../../filesApiSlice'

type Props = {
	drawing: IDrawing
}

export const Download: FC<Props> = ({ drawing }) => {
	const [download, { isLoading }] = useLazyDownloadFileQuery()

	const downloadHandler = async () => {
		await download({ name: drawing.name, group: drawing.group, origName: drawing.origName })
	}

	return (
		<Button
			onClick={downloadHandler}
			variant='outlined'
			color='inherit'
			fullWidth
			sx={{
				maxWidth: 300,
				textTransform: 'inherit',
				height: 38,
				fontSize: '1rem',
			}}
		>
			{isLoading ? (
				<CircularProgress size={20} sx={{ mr: 1 }} />
			) : (
				<Box
					component={'img'}
					width={22}
					display={'flex'}
					justifyContent={'center'}
					alignItems={'center'}
					mr={1}
					src='/image/download-file.svg'
					alt='download'
				/>
			)}

			<Typography component={'span'} sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
				{drawing.origName}
			</Typography>
		</Button>
	)
}

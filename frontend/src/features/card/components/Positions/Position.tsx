import { FC, MouseEvent } from 'react'
import { IconButton, Skeleton, Stack, Tooltip, Typography } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import CloseIcon from '@mui/icons-material/Close'

import type { Position as PositionType } from '../../types/card'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getActive, setActive } from '../../cardSlice'
import { useDeletePositionMutation, useLazyGetPositionByIdQuery } from '../../cardApiSlice'
import { setSnp } from '@/features/gaskets/modules/snp/snpSlice'
import { PathRoutes } from '@/constants/routes'

type Props = {
	idx: number
	data: PositionType
}
export const Position: FC<Props> = ({ idx, data }) => {
	const active = useAppSelector(getActive)
	const dispatch = useAppDispatch()

	const [remove, { isLoading }] = useDeletePositionMutation()
	const [fetch] = useLazyGetPositionByIdQuery()

	const navigate = useNavigate()
	const location = useLocation()

	const deleteHandler = async (event: MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation()
		event.preventDefault()
		if (active?.id === data.id) {
			dispatch(setActive())
			return
		}
		try {
			await remove(data.id)
		} catch {
			toast.error('Не удалось удалить позицию')
		}
	}

	const selectHandler = async (event: MouseEvent<HTMLDivElement>) => {
		event.stopPropagation()
		console.log('select')

		if (active?.id === data.id) {
			dispatch(setActive())
			return
		}
		//TODO надо еще показывать индикатор загрузки

		// try {
		const payload = await fetch(data.id).unwrap()
		console.log('payload', payload, !payload)
		// } catch {
		// 	//
		// }

		if (!payload) return
		dispatch(setActive({ index: idx, id: data.id, type: payload.data.type }))
		if (payload.data.type == 'Snp') {
			console.log('set snp')
			dispatch(setSnp(payload.data))
			if (location.pathname !== PathRoutes.Gasket.SNP) navigate(PathRoutes.Gasket.SNP)
		}
	}

	if (isLoading) return <Skeleton animation='wave' height={30} sx={{ transform: 'none', mt: 0.5, mb: 1, mr: 1 }} />
	return (
		<Stack
			onClick={selectHandler}
			direction={'row'}
			alignItems={'center'}
			spacing={1}
			mx={-1}
			px={2}
			py={0.5}
			mb={0.5}
			sx={{
				cursor: 'pointer',
				borderRadius: 3,
				transition: 'all 0.3s ease',
				background: active?.id === data.id ? '#d8e0fc65' : 'transparent',
				':hover': { background: '#d8e0fc65' },
			}}
		>
			<Typography color='#0f114e'>{idx + 1}.</Typography>
			<Tooltip title={data.title} enterDelay={500}>
				<Typography
					sx={{
						maxWidth: 310,
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						whiteSpace: 'nowrap',
					}}
				>
					{data.title}
				</Typography>
			</Tooltip>

			<Typography flexGrow={1}>{data.amount} шт.</Typography>

			<Tooltip title='Удалить'>
				<IconButton onClick={deleteHandler} size='small'>
					<CloseIcon fontSize='small' />
				</IconButton>
			</Tooltip>
		</Stack>
	)
}

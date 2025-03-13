import { FC, MouseEvent, useRef, useState } from 'react'
import {
	Button,
	CircularProgress,
	IconButton,
	Popover,
	Skeleton,
	Stack,
	Tooltip,
	Typography,
	useTheme,
} from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import CloseIcon from '@mui/icons-material/Close'

import type { Position as PositionType } from '../../types/card'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getActive, setActive } from '../../cardSlice'
import { useDeletePositionMutation, useLazyGetPositionByIdQuery } from '../../cardApiSlice'
import { setSnp } from '@/features/gaskets/modules/snp/snpSlice'
import { PathRoutes } from '@/constants/routes'
import { setPutg } from '@/features/gaskets/modules/putg/putgSlice'
import { WarningIcon } from '@/components/Icons/WarningIcon'

type Props = {
	idx: number
	data: PositionType
}
export const Position: FC<Props> = ({ idx, data }) => {
	const anchor = useRef<HTMLButtonElement>(null)
	const [open, setOpen] = useState(false)
	const { palette } = useTheme()

	const active = useAppSelector(getActive)
	const dispatch = useAppDispatch()

	const [remove, { isLoading }] = useDeletePositionMutation()
	const [fetch, { isLoading: isFetching }] = useLazyGetPositionByIdQuery()

	const navigate = useNavigate()
	const location = useLocation()

	const toggle = (event: MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation()
		event.preventDefault()
		setOpen(prev => !prev)
	}

	const deleteHandler = async (event: MouseEvent<HTMLButtonElement>) => {
		toggle(event)

		if (active?.id === data.id) {
			dispatch(setActive())
			return
		}
		try {
			await remove(data)
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

		const payload = await fetch(data.id).unwrap()
		if (!payload) return

		dispatch(setActive({ index: idx, id: data.id, type: payload.data.type }))
		if (payload.data.type == 'Snp') {
			console.log('set snp')
			dispatch(setSnp(payload.data))
			if (location.pathname !== PathRoutes.Gasket.SNP) navigate(PathRoutes.Gasket.SNP)
		}
		if (payload.data.type == 'Putg') {
			console.log('set putg')
			dispatch(setPutg(payload.data))
			if (location.pathname !== PathRoutes.Gasket.PUTG) navigate(PathRoutes.Gasket.PUTG)
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
			{isFetching ? <CircularProgress size={16} /> : <Typography color='#0f114e'>{idx + 1}.</Typography>}
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

			<Stack>
				<Tooltip title='Удалить'>
					<IconButton ref={anchor} onClick={toggle} size='small'>
						<CloseIcon fontSize='small' />
					</IconButton>
				</Tooltip>

				<Popover
					open={open}
					anchorEl={anchor.current}
					onClose={toggle}
					anchorOrigin={{
						vertical: 'center',
						horizontal: 'left',
					}}
					transformOrigin={{
						vertical: 'center',
						horizontal: 'right',
					}}
					slotProps={{
						paper: {
							elevation: 0,
							sx: {
								py: 1.2,
								px: 2,
								mr: 0.5,
								filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
								overflow: 'visible',
								'&:before': {
									content: '""',
									display: 'block',
									position: 'absolute',
									top: '50%',
									right: -5,
									width: 10,
									height: 10,
									bgcolor: 'background.paper',
									transform: 'translateY(-50%) rotate(45deg)',
									zIndex: 0,
								},
							},
						},
					}}
				>
					<Stack mb={2}>
						<Stack spacing={1} direction={'row'} justifyContent={'center'} alignItems={'center'} mb={1}>
							<WarningIcon fill={palette.warning.main} />
							<Typography fontSize={'1.1rem'} fontWeight={'bold'} align='center'>
								Удалить позицию
							</Typography>
						</Stack>

						<Typography maxWidth={260} align='center'>
							Вы уверены, что хотите удалить позицию?
						</Typography>
					</Stack>

					<Stack direction='row' spacing={2} px={2}>
						<Button onClick={toggle} fullWidth>
							Отмена
						</Button>
						<Button onClick={deleteHandler} variant='outlined' fullWidth>
							Да
						</Button>
					</Stack>
				</Popover>
			</Stack>
		</Stack>
	)
}

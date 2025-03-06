import { useEffect, useState } from 'react'
import { Button, Collapse, Divider, IconButton, Stack, Typography } from '@mui/material'
import { toast } from 'react-toastify'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import CloseIcon from '@mui/icons-material/Close'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { useGetOrderQuery, useSaveOrderMutation } from '@/features/orders/ordersApiSlice'
import { getRole } from '@/features/user/userSlice'
import { Fallback } from '@/features/auth/components/Forms/Fallback'
import { getOpen, setOrder, toggle } from '../../cardSlice'
import { Positions } from '../Positions/Positions'
import { Info } from '../Info/Info'

export const Card = () => {
	const [hasScroll, setHasScroll] = useState(false)

	const open = useAppSelector(getOpen)
	const role = useAppSelector(getRole)
	const dispatch = useAppDispatch()

	const { data, isFetching, isError } = useGetOrderQuery(null)
	const [save, { isLoading }] = useSaveOrderMutation()

	useEffect(() => {
		if (data) dispatch(setOrder(data.data))
	}, [data, dispatch])

	useEffect(() => {
		const handleScroll = () => {
			setHasScroll(window.scrollY > 70)
		}

		document.addEventListener('scroll', handleScroll)
		return () => {
			document.removeEventListener('scroll', handleScroll)
		}
	}, [])

	const toggleHandler = () => {
		dispatch(toggle())
	}

	const saveHandler = async () => {
		if (!data || !data?.data.positions?.length) return
		try {
			await save({ id: data.data.id, count: data.data.positions.length }).unwrap()
			toast.success('Заявка отправлена. Ожидайте ответа менеджера')
		} catch {
			toast.error('Не удалось сохранить заявку')
		}
	}

	return (
		<Stack minWidth={{ xl: open ? 500 : 26, lg: 26 }} ml={2} sx={{ transition: 'all 0.3s ease-in-out' }}>
			<Stack
				direction={'row'}
				sx={{
					position: 'fixed',
					zIndex: 1000,
					bottom: 10,
					right: open ? 10 : 0,
					top: hasScroll ? 10 : 70,
					background: '#fff',
					minWidth: 26,
					borderRadius: open ? 3 : '12px 0 0 12px',
					boxShadow: '0px 0px 4px 0px #2626262b',
					transition: 'all 0.3s ease-in-out',
				}}
			>
				{isFetching && isLoading ? <Fallback /> : null}

				<Collapse orientation='horizontal' in={!open} sx={{ height: '100%' }}>
					<Stack
						onClick={toggleHandler}
						justifyContent={'center'}
						height={'100%'}
						sx={{
							cursor: 'pointer',
							transition: 'all 0.3s ease-in-out',
							':hover': {
								background: '#eaeefc78',
								'.MuiSvgIcon-root': { color: 'var(--primary-color)' },
							},
						}}
					>
						<ArrowBackIosNewIcon color='action' sx={{ transition: 'all 0.3s ease-in-out' }} />
					</Stack>
				</Collapse>
				<Collapse orientation='horizontal' in={open} sx={{ height: '100%' }}>
					<Stack width={{ md: '500px', sm: '100%' }} height={'100%'}>
						<Stack py={1} px={2} direction={'row'} justifyContent={'space-between'}>
							<Typography variant='h5' sx={{ marginBottom: 1 }}>
								Заявка
							</Typography>

							<IconButton onClick={toggleHandler}>
								<CloseIcon />
							</IconButton>
						</Stack>
						<Divider sx={{ width: '94%', mx: 'auto' }} />

						{isError ? (
							<Typography mt={2} px={2} variant='h6' color={'error'}>
								Не удалось загрузить содержание заявки
							</Typography>
						) : (
							data && (
								<Stack pb={1} px={2} sx={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden' }}>
									<Positions data={data?.data.positions || []} />
									<Info order={data?.data.id || ''} data={data?.data.info || ''} />
									<Button
										onClick={saveHandler}
										variant='outlined'
										disabled={!data.data.positions?.length || role != 'user'}
										sx={{ borderRadius: '12px', marginTop: '10px' }}
									>
										Отправить заявку
									</Button>
								</Stack>
							)
						)}
					</Stack>
				</Collapse>
			</Stack>
		</Stack>
	)
}
export default Card

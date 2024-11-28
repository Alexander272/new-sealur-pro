import { Button, CircularProgress, Stack } from '@mui/material'
import { toast } from 'react-toastify'

import type { IFetchError } from '@/app/types/error'
import type { Position } from '@/features/card/types/card'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { useCreatePositionMutation, useUpdatePositionMutation } from '@/features/card/cardApiSlice'
import { clearActive, getActive, getOrderId, getPositions } from '@/features/card/cardSlice'
import { getRole } from '@/features/user/userSlice'
import {
	clearSnp,
	getAmount,
	getDesign,
	getHasDesignError,
	getHasSizeError,
	getInfo,
	getMain,
	getMaterials,
	getSize,
	setDesignDrawing,
} from '../../snpSlice'
import { useDesignation } from '../../hooks/designation'

export const Buttons = () => {
	const active = useAppSelector(getActive)
	const role = useAppSelector(getRole)

	const amount = useAppSelector(getAmount)
	const info = useAppSelector(getInfo)
	const main = useAppSelector(getMain)
	const materials = useAppSelector(getMaterials)
	const size = useAppSelector(getSize)
	const design = useAppSelector(getDesign)
	const hasSizeError = useAppSelector(getHasSizeError)
	const hasDesignError = useAppSelector(getHasDesignError)

	const orderId = useAppSelector(getOrderId)
	const positions = useAppSelector(getPositions)

	const designation = useDesignation()

	const dispatch = useAppDispatch()

	const [create, { isLoading }] = useCreatePositionMutation()
	const [update, { isLoading: isLoadingUpdate }] = useUpdatePositionMutation()

	const cancelHandler = () => {
		dispatch(clearSnp())
		dispatch(clearActive())
	}

	const savePosition = async () => {
		const position: Position = {
			id: Date.now().toString() + (positions.length + 1),
			orderId: orderId,
			count: positions.length > 0 ? positions[positions.length - 1].count + 1 : 1,
			title: designation,
			amount: amount,
			info: info,
			type: 'Snp',
			snpData: {
				main: main,
				size: size,
				material: materials,
				design: design,
			},
		}
		try {
			if (active?.index !== undefined) {
				position.id = positions[active.index].id
				position.count = positions[active.index].count
				// dispatch(updatePosition({ index: cardIndex, position: position }))
				await update(position).unwrap()
				dispatch(clearSnp())
				dispatch(clearActive())
			} else {
				await create(position).unwrap()
				// dispatch(addPosition(position))
			}
			dispatch(setDesignDrawing(null))
			toast.success(active?.index ? 'Позиция успешно обновлена' : 'Позиция успешно добавлена')
		} catch (error) {
			const fetchError = error as IFetchError
			toast.error(
				active?.index
					? 'Не удалось обновить позицию'
					: `Не удалось добавить позицию. ${fetchError.data.message}`
			)
		}
	}

	return (
		<Stack direction={'row'} spacing={2}>
			{active?.index !== undefined && (
				<Button
					onClick={cancelHandler}
					disabled={isLoading || isLoadingUpdate}
					variant='outlined'
					color='secondary'
					sx={{ maxWidth: 240, width: '100%' }}
				>
					Отменить
				</Button>
			)}

			<Button
				disabled={!amount || hasSizeError || hasDesignError || role != 'user' || isLoading || isLoadingUpdate}
				onClick={savePosition}
				variant='contained'
				sx={{ maxWidth: 240, width: '100%' }}
			>
				{isLoading || isLoadingUpdate ? <CircularProgress size={18} /> : null}

				{active?.index !== undefined ? 'Изменить в заявке' : 'Добавить  в заявку'}
			</Button>
		</Stack>
	)
}

// import { Button, CircularProgress, Stack } from '@mui/material'
// import { toast } from 'react-toastify'

// import type { IFetchError } from '@/app/types/error'
// import type { PositionDTO } from '@/features/card/types/card'
// import { useAppDispatch, useAppSelector } from '@/hooks/redux'
// import { useCreatePositionMutation, useUpdatePositionMutation } from '@/features/card/cardApiSlice'
// import { clearActive, getActive, getOrderId, getPositions } from '@/features/card/cardSlice'
// import { getRole } from '@/features/user/userSlice'
// // import { useDesignation } from '../../hooks/designation'
// // import {
// // 	clearPutg,
// // 	getAmount,
// // 	getDesign,
// // 	getHasDesignError,
// // 	getHasSizeError,
// // 	getInfo,
// // 	getMain,
// // 	getMaterials,
// // 	getSizes,
// // 	setDesignDrawing,
// // } from '../../waveSlice'

// export const Buttons = () => {
// 	const active = useAppSelector(getActive)
// 	const role = useAppSelector(getRole)

// 	// const amount = useAppSelector(getAmount)
// 	// const info = useAppSelector(getInfo)
// 	// const main = useAppSelector(getMain)
// 	// const materials = useAppSelector(getMaterials)
// 	// const size = useAppSelector(getSizes)
// 	// const design = useAppSelector(getDesign)
// 	// const hasSizeError = useAppSelector(getHasSizeError)
// 	// const hasDesignError = useAppSelector(getHasDesignError)

// 	// const orderId = useAppSelector(getOrderId)
// 	// const positions = useAppSelector(getPositions)

// 	// const designation = useDesignation()

// 	const dispatch = useAppDispatch()

// 	const [create, { isLoading }] = useCreatePositionMutation()
// 	const [update, { isLoading: isLoadingUpdate }] = useUpdatePositionMutation()

// 	const cancelHandler = () => {
// 		dispatch(clearPutg())
// 		dispatch(clearActive())
// 	}

// 	const savePosition = async () => {
// 		// const position: PositionDTO = {
// 		// 	id: Date.now().toString() + (positions.length + 1),
// 		// 	orderId: orderId,
// 		// 	count: positions.length > 0 ? positions[positions.length - 1].count + 1 : 1,
// 		// 	title: designation,
// 		// 	amount: amount,
// 		// 	info: info,
// 		// 	type: 'Putg',
// 		// 	putgData: {
// 		// 		main: {
// 		// 			configurationId: main.configuration?.id || '',
// 		// 			standardId: main.standard?.id || '',
// 		// 			flangeTypeId: main.flangeType?.id || '',
// 		// 		},
// 		// 		size: {
// 		// 			...size,
// 		// 			d4: size.sizeId ? '' : size.d4,
// 		// 			d3: size.sizeId ? '' : size.d3,
// 		// 			d2: size.sizeId ? '' : size.d2,
// 		// 			d1: size.sizeId ? '' : size.d1,
// 		// 		},
// 		// 		material: {
// 		// 			fillerId: materials.filler?.id || '',
// 		// 			typeId: materials.putgType?.id || '',
// 		// 			constructionId: materials.construction?.id || '',
// 		// 			rotaryPlugId: materials.rotaryPlug?.id || '',
// 		// 			innerRingId: materials.innerRing?.id || '',
// 		// 			outerRingId: materials.outerRing?.id || '',
// 		// 		},
// 		// 		design: {
// 		// 			jumper: {
// 		// 				code: design.jumper.hasJumper ? design.jumper.code : '',
// 		// 				width: design.jumper.width,
// 		// 			},
// 		// 			hasHole: design.hasHole,
// 		// 			hasCoating: design.hasCoating,
// 		// 			hasRemovable: design.hasRemovable,
// 		// 			drawing: design.drawing,
// 		// 		},
// 		// 	},
// 		// }
// 		// try {
// 		// 	if (active?.index !== undefined) {
// 		// 		position.id = positions[active.index].id
// 		// 		position.count = positions[active.index].count
// 		// 		await update(position).unwrap()
// 		// 		dispatch(clearPutg())
// 		// 		dispatch(clearActive())
// 		// 	} else {
// 		// 		await create(position).unwrap()
// 		// 		//TODO после сохранения позиции с чертежом появляется надпись о необходимости загрузить чертеж, что не правильно
// 		// 	}
// 		// 	dispatch(setDesignDrawing())
// 		// 	toast.success(active?.index ? 'Позиция успешно обновлена' : 'Позиция успешно добавлена')
// 		// } catch (error) {
// 		// 	const fetchError = error as IFetchError
// 		// 	toast.error(
// 		// 		active?.index
// 		// 			? 'Не удалось обновить позицию'
// 		// 			: `Не удалось добавить позицию. ${fetchError.data.message}`
// 		// 	)
// 		// }
// 	}

// 	return (
// 		<Stack direction={'row'} spacing={2}>
// 			{active?.index !== undefined && (
// 				<Button
// 					onClick={cancelHandler}
// 					disabled={isLoading || isLoadingUpdate}
// 					variant='outlined'
// 					color='secondary'
// 					sx={{ maxWidth: 240, padding: '6px 20px' }}
// 				>
// 					Отменить
// 				</Button>
// 			)}

// 			<Button
// 				disabled={!amount || hasSizeError || hasDesignError || role != 'user' || isLoading || isLoadingUpdate}
// 				onClick={savePosition}
// 				variant='outlined'
// 				sx={{ maxWidth: 240, padding: '6px 20px' }}
// 			>
// 				{isLoading || isLoadingUpdate ? <CircularProgress size={18} /> : null}

// 				{active?.index !== undefined ? 'Изменить в заявке' : 'Добавить  в заявку'}
// 			</Button>
// 		</Stack>
// 	)
// }

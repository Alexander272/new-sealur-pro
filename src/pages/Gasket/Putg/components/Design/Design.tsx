import { ChangeEvent, FC, useState } from 'react'
import { Alert, SelectChangeEvent, Snackbar, Stack, Typography } from '@mui/material'
import type { IMainJumper } from '@/types/jumper'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { useGetPutgQuery } from '@/store/api/putg'
import {
	setDesignDrawing,
	setDesignJumper,
	setDesignMounting,
	setHasCoating,
	setHasHole,
	setHasRemovable,
} from '@/store/gaskets/putg'
import { CreateFile, DeleteFile } from '@/services/file'
import { Checkbox } from '@/components/Checkbox/Checkbox'
import { JumperSelect } from '@/components/Jumper/Jumper'
import { Loader } from '@/components/Loader/Loader'
import { FileDownload } from '@/components/FileInput/FileDownload'
import { FileInput } from '@/components/FileInput/FileInput'
import { Input } from '@/components/Input/input.style'
import { DesignSkeleton } from '@/pages/Gasket/Skeletons/DesignSkeleton'
import { AsideContainer } from '@/pages/Gasket/gasket.style'

type Props = {}

type Alert = { type: 'create' | 'delete'; open: boolean; message?: string }

export const Design: FC<Props> = () => {
	const [alert, setAlert] = useState<Alert>({ type: 'create', open: false })
	const [loading, setLoading] = useState(false)

	const isReady = useAppSelector(state => state.putg.isReady)

	const design = useAppSelector(state => state.putg.design)
	const main = useAppSelector(state => state.putg.main)
	const material = useAppSelector(state => state.putg.material)
	// const mountings = useAppSelector(state => state.putg.mountings)
	const drawing = useAppSelector(state => state.putg.drawing)
	const hasDesignError = useAppSelector(state => state.putg.hasDesignError)
	const orderId = useAppSelector(state => state.card.orderId)

	const role = useAppSelector(state => state.user.roleCode)

	const dispatch = useAppDispatch()

	const { data, isError, isFetching } = useGetPutgQuery(
		{
			fillerId: material.filler?.id || '',
			baseId: material.filler?.baseId || '',
			flangeTypeId: main.flangeType?.id || '',
		},
		{ skip: !material.filler || !main.flangeType?.id }
	)

	const jumperHandler = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(setDesignJumper({ hasJumper: event.target.checked }))
	}
	const holeHandler = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(setHasHole(event.target.checked))
	}
	const coatingHandler = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(setHasCoating(event.target.checked))
	}
	const removableHandler = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(setHasRemovable(event.target.checked))
	}
	const mountingHandler = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(setDesignMounting({ hasMounting: event.target.checked }))
	}

	const jumperSelectHandler = (jumper: IMainJumper) => {
		dispatch(setDesignJumper({ code: jumper.code, hasDrawing: jumper.hasDrawing }))
	}
	const jumperWidthHandler = (event: ChangeEvent<HTMLInputElement>) => {
		const regex = /^[0-9\b]+$/
		if (event.target.value === '' || regex.test(event.target.value)) {
			let value: number | string = +event.target.value
			if (event.target.value === '') value = event.target.value
			dispatch(setDesignJumper({ width: value.toString() }))
		}
	}

	const mountingTitleHandler = (event: SelectChangeEvent<string>) => {
		dispatch(setDesignMounting({ code: event.target.value }))
	}

	const uploadFile = async (event: ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files
		if (!files) return

		const formData = new FormData()
		formData.append('drawing', files[0])
		formData.append('group', orderId)

		setLoading(true)
		const res = await CreateFile('files/drawings/pro', formData)
		if (res.data) {
			dispatch(setDesignDrawing(res.data))
		}
		if (res.error) {
			if (res.error == 'Слишком большой файл') setAlert({ type: 'create', open: true, message: res.error })
			else setAlert({ type: 'create', open: true })
		}
		setLoading(false)
	}

	const deleteFile = async () => {
		const res = await DeleteFile(`files/drawings/pro/${drawing?.group}/${drawing?.id}/${drawing?.origName}`)
		if (!res.error) {
			dispatch(setDesignDrawing(null))
		}
		if (res.error) {
			setAlert({ type: 'create', open: true })
		}
	}

	const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') {
			return
		}
		setAlert({ type: 'create', open: false })
	}

	if (!isReady) {
		return (
			<AsideContainer rowStart={6} rowEnd={9}>
				<DesignSkeleton />
			</AsideContainer>
		)
	}

	return (
		<>
			{loading ? <Loader background='fill' /> : null}
			<AsideContainer rowStart={6} rowEnd={9}>
				<Snackbar
					open={alert.open}
					autoHideDuration={6000}
					onClose={handleClose}
					anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
				>
					<Alert onClose={handleClose} severity={'error'} sx={{ width: '100%' }}>
						{alert.type == 'create' && 'Не удалось добавить чертеж. ' + (alert.message || '')}
						{alert.type == 'delete' && 'Не удалось удалить чертеж.'}
					</Alert>
				</Snackbar>

				{isError && (
					<Typography variant='h6' color={'error'} align='center'>
						Не удалось загрузить конструктивные элементы
					</Typography>
				)}

				{!isError && data ? (
					<>
						<Typography fontWeight='bold'>Конструктивные элементы</Typography>

						<Checkbox
							id='holes'
							name='holes'
							label='Отверстия'
							checked={design.hasHole}
							disabled={!data?.data.data.hasHole || isFetching}
							onChange={holeHandler}
						/>

						<Checkbox
							id='coating'
							name='coating'
							label='Самоклеящееся покрытие'
							checked={design.hasCoating}
							disabled={!data?.data.data.hasCoating || isFetching}
							onChange={coatingHandler}
						/>

						<Checkbox
							id='removable'
							name='removable'
							label='Разъемная'
							checked={design.hasRemovable}
							disabled={!data?.data.data.hasRemovable || isFetching}
							onChange={removableHandler}
						/>

						<Stack direction='row' spacing={2} marginBottom={3}>
							<Checkbox
								id='jumper'
								name='jumper'
								label='Перемычка'
								checked={design.jumper.hasJumper}
								disabled={!data?.data.data.hasJumper || isFetching}
								onChange={jumperHandler}
							/>

							{design.jumper.hasJumper && (
								<>
									<JumperSelect value={design.jumper.code} onSelect={jumperSelectHandler} />
									<Input
										value={design.jumper.width}
										onChange={jumperWidthHandler}
										placeholder='Ширина перемычки'
										disabled={isFetching}
										size='small'
									/>
								</>
							)}
						</Stack>

						{/* <Stack direction='row' spacing={2} marginBottom={3}>
							<Checkbox
								id='mounting'
								name='mounting'
								label='Крепление на вертикальном фланце'
								checked={design.mounting.hasMounting}
								disabled={!data?.data.data.hasMounting || isFetching}
								onChange={mountingHandler}
							/>

							{design.mounting.hasMounting && (
								<Select
									value={design.mounting.code || 'not_selected'}
									onChange={mountingTitleHandler}
									disabled={isFetching}
									size='small'
									sx={{
										borderRadius: '12px',
									}}
								>
									<MenuItem value='not_selected' disabled>
										Выберите тип крепления
									</MenuItem>
									{mountings?.map(m => (
										<MenuItem key={m.id} value={m.title}>
											{m.title}
										</MenuItem>
									))}
								</Select>
							)}
						</Stack> */}

						{role != 'manager' ? (
							drawing ? (
								<FileDownload text={drawing.origName} link={drawing.link} onDelete={deleteFile} />
							) : (
								<FileInput name='drawing' id='file' label={'Прикрепить чертеж'} onChange={uploadFile} />
							)
						) : null}
					</>
				) : null}

				{hasDesignError && (
					<Typography sx={{ marginTop: 1, color: 'var(--danger-color)', fontSize: '1.4rem' }}>
						К заявке приложите файл с чертежом.
					</Typography>
				)}
			</AsideContainer>
		</>
	)
}

import { Alert, MenuItem, Select, SelectChangeEvent, Snackbar, Stack, Typography } from '@mui/material'
import { ChangeEvent, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import {
	setHasHole,
	setDesignJumper,
	setDesignMounting,
	setDesignDrawing,
	clearMaterialAndDesign,
} from '@/store/gaskets/snp'
import { useGetSnpQuery } from '@/store/api/snp'
import { IMainJumper } from '@/types/jumper'
import { AsideContainer, Image } from '@/pages/Gasket/gasket.style'
import { Checkbox } from '@/components/Checkbox/Checkbox'
import { JumperSelect } from '@/components/Jumper/Jumper'
import { Input } from '@/components/Input/input.style'
import { FileDownload } from '@/components/FileInput/FileDownload'
import { FileInput } from '@/components/FileInput/FileInput'
import { CreateFile, DeleteFile } from '@/services/file'

export const Design = () => {
	const [alert, setAlert] = useState<{ type: 'create' | 'delete'; open: boolean }>({ type: 'create', open: false })

	const main = useAppSelector(state => state.snp.main)
	const design = useAppSelector(state => state.snp.design)
	const mountings = useAppSelector(state => state.snp.mountings)
	const drawing = useAppSelector(state => state.snp.drawing)
	const hasDesignError = useAppSelector(state => state.snp.hasDesignError)
	const orderId = useAppSelector(state => state.card.orderId)

	const role = useAppSelector(state => state.user.roleCode)

	const dispatch = useAppDispatch()

	const { data } = useGetSnpQuery(
		{ typeId: main.snpTypeId, hasD2: main.snpStandard?.hasD2 },
		{ skip: main.snpTypeId == 'not_selected' }
	)

	useEffect(() => {
		if (data) dispatch(clearMaterialAndDesign(data.data.snp))
	}, [data])

	const jumperHandler = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(setDesignJumper({ hasJumper: event.target.checked }))
	}
	const holeHandler = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(setHasHole(event.target.checked))
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

		const res = await CreateFile('files/drawings/pro/', formData)
		if (res.data) {
			dispatch(setDesignDrawing(res.data))
		}
		if (res.error) {
			setAlert({ type: 'create', open: true })
		}
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

	return (
		<AsideContainer>
			<Snackbar
				open={alert.open}
				autoHideDuration={6000}
				onClose={handleClose}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
			>
				<Alert onClose={handleClose} severity={'error'} sx={{ width: '100%' }}>
					{alert.type == 'create' && 'Не удалось добавить чертеж'}
					{alert.type == 'delete' && 'Не удалось удалить чертеж'}
				</Alert>
			</Snackbar>

			<Typography fontWeight='bold'>Конструктивные элементы</Typography>
			<Stack direction='row' spacing={2} marginBottom={1}>
				<Checkbox
					id='jumper'
					name='jumper'
					label='Перемычка'
					checked={design.jumper.hasJumper}
					disabled={!data?.data.snp.hasJumper}
					onChange={jumperHandler}
				/>

				{design.jumper.hasJumper && (
					<>
						<JumperSelect value={design.jumper.code} onSelect={jumperSelectHandler} />
						<Input
							value={design.jumper.width}
							onChange={jumperWidthHandler}
							placeholder='Ширина перемычки'
							size='small'
						/>
					</>
				)}
			</Stack>

			<Checkbox
				id='holes'
				name='holes'
				label='Отверстия в наруж. ограничителе'
				checked={design.hasHole}
				disabled={!data?.data.snp.hasHole}
				onChange={holeHandler}
			/>

			<Stack direction='row' spacing={2} marginTop={1} marginBottom={3}>
				<Checkbox
					id='mounting'
					name='mounting'
					label='Крепление на вертикальном фланце'
					checked={design.mounting.hasMounting}
					disabled={!data?.data.snp.hasMounting}
					onChange={mountingHandler}
				/>

				{design.mounting.hasMounting && (
					<Select
						value={design.mounting.code || 'not_selected'}
						onChange={mountingTitleHandler}
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
			</Stack>

			{role != 'manager' ? (
				drawing ? (
					<FileDownload text={drawing.origName} link={drawing.link} onDelete={deleteFile} />
				) : (
					<FileInput name='drawing' id='file' label={'Прикрепить чертеж'} onChange={uploadFile} />
				)
			) : null}

			{hasDesignError && (
				<Typography sx={{ marginTop: 1, color: 'var(--danger-color)', fontSize: '1.4rem' }}>
					К заявке приложите файл с чертежом.
				</Typography>
			)}
		</AsideContainer>
	)
}

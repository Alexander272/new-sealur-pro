import { FC, useState } from 'react'
import { Alert, MenuItem, Select, SelectChangeEvent, Snackbar, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { AsideContainer } from '@/pages/Gasket/gasket.style'
import { OpenMaterial, TypeMaterial } from '@/types/snp'
import { setMaterialFiller, setMaterial, setMaterialToggle } from '@/store/gaskets/snp'
import { useGetSnpQuery } from '@/store/api/snp'

type Props = {}

export const Materials: FC<Props> = () => {
	const [alert, setAlert] = useState<{ type: 'error' | 'success'; open: boolean }>({ type: 'success', open: false })

	const fillers = useAppSelector(state => state.snp.fillers)
	const materials = useAppSelector(state => state.snp.materials)
	// const materialIr = useAppSelector(state => state.snp.materialsIr)
	// const materialFr = useAppSelector(state => state.snp.materialsFr)
	// const materialOr = useAppSelector(state => state.snp.materialsOr)

	const material = useAppSelector(state => state.snp.material)

	const main = useAppSelector(state => state.snp.main)

	const dispatch = useAppDispatch()

	const { data } = useGetSnpQuery(
		{ typeId: main.snpTypeId, hasD2: main.snpStandard?.hasD2 },
		{ skip: main.snpTypeId == 'not_selected' }
	)

	const openHandler = (type: OpenMaterial) => () => {
		dispatch(setMaterialToggle({ type, isOpen: true }))
	}
	const closeHandler = (type: OpenMaterial) => () => {
		dispatch(setMaterialToggle({ type, isOpen: false }))
	}

	const fillerHandler = (event: SelectChangeEvent<string>) => {
		const filler = fillers.find(f => f.id === event.target.value)
		if (!filler) return

		if (filler.disabledTypes?.includes(main.snpTypeId)) {
			setAlert({ type: 'error', open: true })
			return
		}

		dispatch(setMaterialFiller(filler))
	}

	// const materialIrHandler = (event: SelectChangeEvent<string>) => {
	// 	const material = materialIr?.materials.find(f => f.id === event.target.value)
	// 	if (!material) return
	// 	dispatch(setMaterial({ type: 'ir', material }))
	// }
	// const materialFrHandler = (event: SelectChangeEvent<string>) => {
	// 	const material = materialFr?.materials.find(f => f.id === event.target.value)
	// 	if (!material) return
	// 	dispatch(setMaterial({ type: 'fr', material }))
	// 	dispatch(setMaterial({ type: 'ir', material }))
	// }
	// const materialOrHandler = (event: SelectChangeEvent<string>) => {
	// 	const material = materialOr?.materials.find(f => f.id === event.target.value)
	// 	if (!material) return
	// 	dispatch(setMaterial({ type: 'or', material }))
	// }

	const materialHandler = (type: TypeMaterial) => (event: SelectChangeEvent<string>) => {
		const material = materials?.[type].find(m => m.materialId === event.target.value)
		if (!material) return
		dispatch(setMaterial({ type, material }))
		if (type == 'frame' && data?.data.snp.hasInnerRing) dispatch(setMaterial({ type: 'innerRing', material }))
	}

	const closeAlertHandler = () => {
		setAlert({ type: 'error', open: false })
	}

	return (
		<AsideContainer>
			<Snackbar
				open={alert.open}
				autoHideDuration={6000}
				onClose={closeAlertHandler}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
			>
				<Alert onClose={closeAlertHandler} severity={alert.type} sx={{ width: '100%' }}>
					Данный наполнитель не возможно выбрать с текущей конструкцией
				</Alert>
			</Snackbar>

			<Typography fontWeight='bold'>Тип наполнителя</Typography>
			<Select
				value={material.filler?.id || 'not_selected'}
				onChange={fillerHandler}
				onOpen={openHandler('filler')}
				onClose={closeHandler('filler')}
				disabled={fillers.length == 1}
				size='small'
				sx={{ borderColor: 'var(--border-color)', borderWidth: '2px', borderRadius: '12px', width: '100%' }}
			>
				<MenuItem value='not_selected'>Выберите тип наполнителя</MenuItem>
				{fillers?.map(f => (
					<MenuItem key={f.id} value={f.id} sx={{ color: 'black' }}>
						{f.title} ({f.description} {f.description && ', '} {f.temperature})
					</MenuItem>
				))}
			</Select>

			{/* {materialFr ? (
				<>
					<Typography fontWeight='bold' mt={1}>
						Материал каркаса
					</Typography>
					<Select
						value={material.fr?.id || 'not_selected'}
						onChange={materialFrHandler}
						onOpen={openHandler('fr')}
						onClose={closeHandler('fr')}
						size='small'
						sx={{
							borderColor: 'var(--border-color)',
							borderWidth: '2px',
							borderRadius: '12px',
							width: '100%',
						}}
						disabled={!data?.data.snp.hasFrame}
					>
						<MenuItem value='not_selected'>Выберите материал</MenuItem>
						{materialFr.materials.map(m => (
							<MenuItem key={m.id} value={m.id}>
								{m.title}
							</MenuItem>
						))}
					</Select>
				</>
			) : null}

			{materialIr ? (
				<>
					<Typography fontWeight='bold' mt={1}>
						Материал внутреннего кольца
					</Typography>
					<Select
						value={material.ir?.id || 'not_selected'}
						onChange={materialIrHandler}
						onOpen={openHandler('ir')}
						onClose={closeHandler('ir')}
						size='small'
						sx={{
							borderColor: 'var(--border-color)',
							borderWidth: '2px',
							borderRadius: '12px',
							width: '100%',
						}}
						disabled={!data?.data.snp.hasInnerRing}
					>
						<MenuItem value='not_selected'>Выберите материал</MenuItem>
						{materialIr.materials.map(m => (
							<MenuItem key={m.id} value={m.id}>
								{m.title}
							</MenuItem>
						))}
					</Select>
				</>
			) : null}

			{materialOr ? (
				<>
					<Typography fontWeight='bold' mt={1}>
						Материал наружного кольца
					</Typography>
					<Select
						value={material.or?.id || 'not_selected'}
						onChange={materialOrHandler}
						onOpen={openHandler('or')}
						onClose={closeHandler('or')}
						size='small'
						sx={{
							borderColor: 'var(--border-color)',
							borderWidth: '2px',
							borderRadius: '12px',
							width: '100%',
						}}
						disabled={!data?.data.snp.hasOuterRing}
					>
						<MenuItem value='not_selected'>Выберите материал</MenuItem>
						{materialOr.materials.map(m => (
							<MenuItem key={m.id} value={m.id}>
								{m.title}
							</MenuItem>
						))}
					</Select>
				</>
			) : null} */}

			{materials ? (
				<>
					<Typography fontWeight='bold' mt={1}>
						Материал каркаса
					</Typography>
					<Select
						value={material.frame?.materialId || 'not_selected'}
						onChange={materialHandler('frame')}
						onOpen={openHandler('fr')}
						onClose={closeHandler('fr')}
						size='small'
						sx={{
							borderColor: 'var(--border-color)',
							borderWidth: '2px',
							borderRadius: '12px',
							width: '100%',
						}}
						disabled={!data?.data.snp.hasFrame}
					>
						<MenuItem value='not_selected'>Выберите материал</MenuItem>
						{materials.frame.map(m => (
							<MenuItem key={m.id} value={m.materialId}>
								{m.title}
							</MenuItem>
						))}
					</Select>

					<Typography fontWeight='bold' mt={1}>
						Материал внутреннего кольца
					</Typography>
					<Select
						value={material.innerRing?.materialId || 'not_selected'}
						onChange={materialHandler('innerRing')}
						onOpen={openHandler('ir')}
						onClose={closeHandler('ir')}
						size='small'
						sx={{
							borderColor: 'var(--border-color)',
							borderWidth: '2px',
							borderRadius: '12px',
							width: '100%',
						}}
						disabled={!data?.data.snp.hasInnerRing}
					>
						<MenuItem value='not_selected'>Выберите материал</MenuItem>
						{materials.innerRing.map(m => (
							<MenuItem key={m.id} value={m.materialId}>
								{m.title}
							</MenuItem>
						))}
					</Select>

					<Typography fontWeight='bold' mt={1}>
						Материал наружного кольца
					</Typography>
					<Select
						value={material.outerRing?.materialId || 'not_selected'}
						onChange={materialHandler('outerRing')}
						onOpen={openHandler('or')}
						onClose={closeHandler('or')}
						size='small'
						sx={{
							borderColor: 'var(--border-color)',
							borderWidth: '2px',
							borderRadius: '12px',
							width: '100%',
						}}
						disabled={!data?.data.snp.hasOuterRing}
					>
						<MenuItem value='not_selected'>Выберите материал</MenuItem>
						{materials.outerRing.map(m => (
							<MenuItem key={m.id} value={m.materialId}>
								{m.title}
							</MenuItem>
						))}
					</Select>
				</>
			) : null}
		</AsideContainer>
	)
}

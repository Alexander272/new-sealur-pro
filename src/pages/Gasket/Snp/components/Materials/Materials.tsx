import { FC, useEffect, useState } from 'react'
import { Alert, MenuItem, Select, SelectChangeEvent, Snackbar, Typography } from '@mui/material'
import { OpenMaterial, TypeMaterial } from '@/types/snp'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { useGetSnpQuery } from '@/store/api/snp'
import { setMaterialFiller, setMaterial, setMaterialToggle } from '@/store/gaskets/snp'
import { AsideContainer } from '@/pages/Gasket/gasket.style'
import { Loader } from '@/components/Loader/Loader'

type Props = {}

type Alert = { type: 'error' | 'success'; errType: 'filler' | 'material'; open: boolean }

// часть с наполнителями и материалами каркаса и колец
export const Materials: FC<Props> = () => {
	const [alert, setAlert] = useState<Alert>({ type: 'success', errType: 'filler', open: false })

	const fillers = useAppSelector(state => state.snp.fillers)
	const materials = useAppSelector(state => state.snp.materials)

	const thickness = useAppSelector(state => state.snp.size.h)

	const material = useAppSelector(state => state.snp.material)

	const main = useAppSelector(state => state.snp.main)

	const dispatch = useAppDispatch()

	const { data, isError, isLoading } = useGetSnpQuery(
		{ typeId: main.snpTypeId, hasD2: main.snpStandard?.hasD2 },
		{ skip: main.snpTypeId == 'not_selected' }
	)

	useEffect(() => {
		if (
			(material?.innerRing?.baseCode === '3Ti' && thickness == '3,2') ||
			(material?.outerRing?.baseCode === '3Ti' && thickness == '3,2')
		) {
			setAlert({ type: 'error', errType: 'material', open: true })
		} else {
			setAlert({ type: 'error', errType: 'filler', open: false })
		}
	}, [thickness, material?.innerRing, material?.outerRing])

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
			setAlert({ type: 'error', errType: 'filler', open: true })
			return
		}

		dispatch(setMaterialFiller(filler))
	}

	const materialHandler = (type: TypeMaterial) => (event: SelectChangeEvent<string>) => {
		const material = materials?.[type].find(m => m.materialId === event.target.value)
		if (!material) return
		dispatch(setMaterial({ type, material }))
		if (type == 'frame' && data?.data.snp.hasInnerRing) dispatch(setMaterial({ type: 'innerRing', material }))
	}

	const closeAlertHandler = () => {
		setAlert({ type: 'error', errType: 'filler', open: false })
	}

	if (isError)
		return (
			<AsideContainer>
				<Typography variant='h6' color={'error'} align='center'>
					Не удалось загрузить материалы
				</Typography>
			</AsideContainer>
		)

	return (
		<AsideContainer>
			<Snackbar
				open={alert.open}
				autoHideDuration={12000}
				onClose={closeAlertHandler}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
			>
				<Alert onClose={closeAlertHandler} severity={alert.type} sx={{ width: '100%' }}>
					{alert.errType == 'filler' && 'Данный наполнитель не возможно выбрать с текущей конструкцией'}
					{alert.errType == 'material' && 'Данная сталь недоступна с текущей толщиной'}
				</Alert>
			</Snackbar>

			{!data || isLoading ? (
				<Loader />
			) : (
				<>
					<Typography fontWeight='bold'>Тип наполнителя</Typography>
					<Select
						value={material.filler?.id || 'not_selected'}
						onChange={fillerHandler}
						onOpen={openHandler('filler')}
						onClose={closeHandler('filler')}
						disabled={fillers.length == 1}
						size='small'
						sx={{
							borderColor: 'var(--border-color)',
							borderWidth: '2px',
							borderRadius: '12px',
							width: '100%',
						}}
					>
						<MenuItem value='not_selected'>Выберите тип наполнителя</MenuItem>
						{fillers?.map(f => (
							<MenuItem key={f.id} value={f.id} sx={{ color: 'black' }}>
								{f.title} ({f.description} {f.description && ', '} {f.temperature})
							</MenuItem>
						))}
					</Select>

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
				</>
			)}
		</AsideContainer>
	)
}

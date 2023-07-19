import { FC, useEffect } from 'react'
import { MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'
import type { TypeMaterial } from '@/types/putg'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { useGetPutgQuery } from '@/store/api/putg'
import { setConstruction, setMaterial, setMaterialFiller, setType } from '@/store/gaskets/putg'
import { MaterialSkeleton } from '@/pages/Gasket/Skeletons/MaterialSkeleton'
import { AsideContainer } from '@/pages/Gasket/gasket.style'

type Props = {}

export const Materials: FC<Props> = () => {
	const main = useAppSelector(state => state.putg.main)
	const material = useAppSelector(state => state.putg.material)
	const size = useAppSelector(state => state.putg.size)
	const positionId = useAppSelector(state => state.card.activePosition?.id)

	const materials = useAppSelector(state => state.putg.materials)
	const fillers = useAppSelector(state => state.putg.fillers)

	const isReady = useAppSelector(state => state.putg.isReady)

	const dispatch = useAppDispatch()

	const { data, isError, isFetching } = useGetPutgQuery(
		{
			fillerId: material.filler?.id || '',
			baseId: material.filler?.baseId || '',
			flangeTypeId: main.flangeType?.id || '',
		},
		{ skip: !material.filler || !main.flangeType?.id }
	)

	// useEffect(() => {
	// 	if (!positionId) {
	// 		if (data?.data.putgTypes) dispatch(setType(data.data.putgTypes[0]))
	// 		if (data?.data.constructions) dispatch(setConstruction(data.data.constructions[0]))
	// 	}
	// }, [data])

	const fillerHandler = (event: SelectChangeEvent<string>) => {
		const filler = fillers.find(s => s.id === event.target.value)
		if (!filler) return
		dispatch(setMaterialFiller(filler))
	}

	// const typeHandler = (event: SelectChangeEvent<string>) => {
	// 	const type = data?.data.putgTypes.find(s => s.code === event.target.value)
	// 	if (!type) return
	// 	dispatch(setType(type))
	// }

	// const constructionHandler = (event: SelectChangeEvent<string>) => {
	// 	const construction = data?.data.constructions.find(s => s.code === event.target.value)
	// 	if (!construction) return
	// 	dispatch(setConstruction(construction))
	// }

	const materialHandler = (type: TypeMaterial) => (event: SelectChangeEvent<string>) => {
		const material = materials?.[type].find(m => m.materialId === event.target.value)
		if (!material) return
		dispatch(setMaterial({ type, material }))
	}

	if (!isReady) {
		return (
			<AsideContainer>
				<MaterialSkeleton />
			</AsideContainer>
		)
	}

	return (
		<AsideContainer>
			{isError && (
				<Typography variant='h6' color={'error'} align='center'>
					Не удалось загрузить материалы
				</Typography>
			)}

			{!isError && data ? (
				<>
					<Typography fontWeight='bold'>Материал прокладки</Typography>
					<Select
						value={material.filler?.id || 'not_selected'}
						onChange={fillerHandler}
						disabled={Boolean(positionId) || isFetching}
						size='small'
						sx={{
							borderRadius: '12px',
							width: '100%',
						}}
					>
						<MenuItem disabled value='not_selected'>
							Выберите материал прокладки
						</MenuItem>
						{fillers.map(f => (
							<MenuItem key={f.id} value={f.id}>
								{f.title} ({f.description} {f.description && ', '} {f.temperature})
							</MenuItem>
						))}
					</Select>

					{/* <Typography fontWeight='bold' mt={1}>
						Тип прокладки
					</Typography>
					<Select
						value={material.putgType?.code || 'not_selected'}
						onChange={typeHandler}
						disabled={isFetching}
						size='small'
						sx={{
							borderRadius: '12px',
							width: '100%',
						}}
					>
						<MenuItem disabled value='not_selected'>
							Выберите тип прокладки
						</MenuItem>
						{data?.data.putgTypes.map(f => (
							<MenuItem key={f.id} value={f.code}>
								{f.code} - {f.title}
							</MenuItem>
						))}
					</Select>

					<Typography fontWeight='bold' mt={1}>
						Тип конструкции
					</Typography>
					<Select
						value={material.construction?.code || 'not_selected'}
						onChange={constructionHandler}
						disabled={isFetching}
						size='small'
						sx={{
							borderRadius: '12px',
							width: '100%',
						}}
					>
						<MenuItem disabled value='not_selected'>
							Выберите тип конструкции
						</MenuItem>
						{data?.data.constructions.map(f => (
							<MenuItem key={f.id} value={f.code} disabled={(f.minSize || 0) > +size.d2}>
								{f.code} - {f.title}
							</MenuItem>
						))}
					</Select> */}

					{materials ? (
						<>
							<Typography fontWeight='bold' mt={1}>
								Материал обтюраторов
							</Typography>
							<Select
								value={material.rotaryPlug?.materialId || 'not_selected'}
								onChange={materialHandler('rotaryPlug')}
								size='small'
								sx={{
									borderRadius: '12px',
									width: '100%',
								}}
								disabled={!material.construction?.hasRotaryPlug || isFetching}
							>
								<MenuItem value='not_selected'>Выберите материал</MenuItem>
								{materials.rotaryPlug.map(m => (
									<MenuItem key={m.id} value={m.materialId}>
										{m.title}
									</MenuItem>
								))}
							</Select>

							<Typography fontWeight='bold' mt={1}>
								Материал внутреннего ограничителя
							</Typography>
							<Select
								value={material.innerRing?.materialId || 'not_selected'}
								onChange={materialHandler('innerRing')}
								size='small'
								sx={{
									borderRadius: '12px',
									width: '100%',
								}}
								disabled={!material.construction?.hasInnerRing || isFetching}
							>
								<MenuItem value='not_selected'>Выберите материал</MenuItem>
								{materials.innerRing.map(m => (
									<MenuItem key={m.id} value={m.materialId}>
										{m.title}
									</MenuItem>
								))}
							</Select>

							<Typography fontWeight='bold' mt={1}>
								Материал внешнего ограничителя
							</Typography>
							<Select
								value={material.outerRing?.materialId || 'not_selected'}
								onChange={materialHandler('outerRing')}
								size='small'
								sx={{
									borderRadius: '12px',
									width: '100%',
								}}
								disabled={!material.construction?.hasOuterRing || isFetching}
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
			) : null}
		</AsideContainer>
	)
}

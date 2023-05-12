import { FC, useEffect } from 'react'
import { MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'
import type { TypeMaterial } from '@/types/putg'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { useGetPutgBaseQuery, useGetPutgQuery } from '@/store/api/putg'
import { setConstruction, setMaterial, setMaterialFiller, setType } from '@/store/gaskets/putg'
import { AsideContainer } from '@/pages/Gasket/gasket.style'

type Props = {}

export const Materials: FC<Props> = () => {
	const main = useAppSelector(state => state.putg.main)
	const material = useAppSelector(state => state.putg.material)
	const positionId = useAppSelector(state => state.putg.positionId)

	const materials = useAppSelector(state => state.putg.materials)
	const fillers = useAppSelector(state => state.putg.fillers)

	const dispatch = useAppDispatch()

	const {
		data: base,
		isError: isErrorBase,
		isLoading: isLoadingBase,
	} = useGetPutgBaseQuery({ standardId: main.standard?.id || '', typeFlangeId: main.flangeType?.id || '' })

	const { data, isError, isLoading } = useGetPutgQuery(
		{ fillerId: material.filler?.id || '', baseId: material.filler?.baseId || '' },
		{ skip: !material.filler }
	)

	useEffect(() => {
		if (!positionId && data?.data.putgTypes) {
			dispatch(setType(data.data.putgTypes[0]))
		}
	}, [data])

	const fillerHandler = (event: SelectChangeEvent<string>) => {
		const filler = fillers.find(s => s.id === event.target.value)
		if (!filler) return
		dispatch(setMaterialFiller(filler))
	}

	const typeHandler = (event: SelectChangeEvent<string>) => {
		const type = data?.data.putgTypes.find(s => s.code === event.target.value)
		if (!type) return
		dispatch(setType(type))
	}

	const constructionHandler = (event: SelectChangeEvent<string>) => {
		const construction = base?.data.constructions.find(s => s.code === event.target.value)
		if (!construction) return
		dispatch(setConstruction(construction))
	}

	const materialHandler = (type: TypeMaterial) => (event: SelectChangeEvent<string>) => {
		const material = materials?.[type].find(m => m.materialId === event.target.value)
		if (!material) return
		dispatch(setMaterial({ type, material }))
	}

	return (
		<AsideContainer rowStart={1} rowEnd={6}>
			<Typography fontWeight='bold'>Материал прокладки</Typography>
			<Select
				value={material.filler?.id || 'not_selected'}
				onChange={fillerHandler}
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

			<Typography fontWeight='bold' mt={1}>
				Тип прокладки
			</Typography>
			<Select
				value={material.type?.code || 'not_selected'}
				onChange={typeHandler}
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
						{f.title}
					</MenuItem>
				))}
			</Select>

			<Typography fontWeight='bold' mt={1}>
				Тип конструкции
			</Typography>
			<Select
				value={material.construction?.code || 'not_selected'}
				onChange={constructionHandler}
				size='small'
				sx={{
					borderRadius: '12px',
					width: '100%',
				}}
			>
				<MenuItem disabled value='not_selected'>
					Выберите тип конструкции
				</MenuItem>
				{base?.data.constructions.map(f => (
					<MenuItem key={f.id} value={f.code}>
						{f.title}
					</MenuItem>
				))}
			</Select>

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
						disabled={!material.construction?.hasRotaryPlug}
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
						disabled={!material.construction?.hasInnerRing}
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
						disabled={!material.construction?.hasOuterRing}
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

import { MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'
import { FC } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { useGetPutgBaseQuery, useGetPutgDataQuery } from '@/store/api/putg'
import { setConstruction, setMaterialFiller } from '@/store/gaskets/putg'
import { AsideContainer } from '@/pages/Gasket/gasket.style'

type Props = {}

export const Materials: FC<Props> = () => {
	const main = useAppSelector(state => state.putg.main)
	const material = useAppSelector(state => state.putg.material)

	const materials = useAppSelector(state => state.putg.materials)

	const dispatch = useAppDispatch()

	const { data: base, isError: isErrorBase, isLoading: isLoadingBase } = useGetPutgBaseQuery(null)

	const { data, isError, isLoading } = useGetPutgDataQuery(
		{
			standardId: main.flangeStandard?.id || '',
			constructionId: 'e3089c9c-54c2-4248-9341-734e22dba223',
			configuration: main.configuration?.code || '',
			// constructionId: main.,
		},
		{ skip: !main.flangeStandard?.id }
	)

	const fillerHandler = (event: SelectChangeEvent<string>) => {
		const filler = data?.data.fillers.find(s => s.id === event.target.value)
		if (!filler) return
		dispatch(setMaterialFiller(filler))
	}

	const constructionHandler = (event: SelectChangeEvent<string>) => {
		const construction = base?.data.constructions.find(s => s.code === event.target.value)
		if (!construction) return
		dispatch(setConstruction(construction))
	}

	return (
		<AsideContainer>
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
				{data?.data.fillers.map(f => (
					<MenuItem key={f.id} value={f.id}>
						{f.title} ({f.description} {f.description && ', '} {f.temperature})
					</MenuItem>
				))}
			</Select>

			<Typography fontWeight='bold'>Тип прокладки</Typography>

			<Typography fontWeight='bold'>Тип конструкции</Typography>
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
					<Typography fontWeight='bold'>Материал обтюраторов</Typography>
					<Select
						value={material.rotaryPlug?.materialId || 'not_selected'}
						// onChange={materialHandler('rotaryPlug')}
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
					<Typography fontWeight='bold'>Материал внутреннего ограничителя</Typography>
					<Select
						value={material.innerRing?.materialId || 'not_selected'}
						// onChange={materialHandler('rotaryPlug')}
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
					<Typography fontWeight='bold'>Материал внешнего ограничителя</Typography>
					<Select
						value={material.outerRing?.materialId || 'not_selected'}
						// onChange={materialHandler('rotaryPlug')}
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

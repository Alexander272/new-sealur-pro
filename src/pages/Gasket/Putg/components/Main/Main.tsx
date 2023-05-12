import { FC, useEffect } from 'react'
import { MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'
import {
	setConfigurations,
	setConstruction,
	setFiller,
	setFlangeTypes,
	setMainConfiguration,
	setMainFlangeType,
	setMainStandard,
	setMaterials,
	setMounting,
	setStandards,
} from '@/store/gaskets/putg'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { useGetPutgBaseQuery, useGetPutgDataQuery } from '@/store/api/putg'
import { Loader } from '@/components/Loader/Loader'
import { RadioGroup, RadioItem } from '@/components/RadioGroup/RadioGroup'
import { Column, Image, MainContainer, PlugImage } from '@/pages/Gasket/gasket.style'

import FlangeA from '@/assets/putg/PUTG-A.webp'
import FlangeB from '@/assets/putg/PUTG-B.webp'
import FlangeV from '@/assets/putg/PUTG-C.webp'

const images = {
	А: FlangeA,
	Б: FlangeB,
	В: FlangeV,
}

type Props = {}

export const Main: FC<Props> = () => {
	const main = useAppSelector(state => state.putg.main)
	const material = useAppSelector(state => state.putg.material)
	const positionId = useAppSelector(state => state.putg.positionId)

	const standards = useAppSelector(state => state.putg.standards)
	const configurations = useAppSelector(state => state.putg.configurations)
	const flangeTypes = useAppSelector(state => state.putg.flangeTypes)

	const dispatch = useAppDispatch()

	const {
		data: base,
		isError: isErrorBase,
		isLoading: isLoadingBase,
	} = useGetPutgBaseQuery({ standardId: main.standard?.id || '', typeFlangeId: main.flangeType?.id || '' })

	const { data, isError, isLoading } = useGetPutgDataQuery(
		{
			standardId: main.standard?.id || '',
			constructionId: material.construction?.id || '',
			baseConstructionId: material.construction?.baseId || '',
			configuration: main.configuration?.code || '',
		},
		{ skip: !main.standard?.id || !material.construction }
	)

	useEffect(() => {
		if (base) {
			if (base.data.configurations) dispatch(setConfigurations(base.data.configurations))
			if (base.data.standards) dispatch(setStandards(base.data.standards))
			if (base.data.materials?.rotaryPlug) dispatch(setMaterials(base.data.materials))
			if (base.data.mounting) dispatch(setMounting(base.data.mounting))

			if (base.data.flangeTypes) {
				dispatch(setFlangeTypes(base.data.flangeTypes))
				// const flange = base.data.flangeTypes[0]
				// dispatch(setMainFlangeType(flange))
			}
			if (base.data.constructions) dispatch(setConstruction(base.data.constructions[0]))
		}
	}, [base?.data])

	useEffect(() => {
		if (data?.data) {
			if (positionId === undefined) {
				// const flange = data.data.flangeTypes[0]
				// dispatch(setMainFlangeType({ code: flange.code, title: flange.title }))
				// const filler = data.data.fillers[0]
				// dispatch(setMaterialFiller(filler))
				// const type = {
				// 	id: flange.types[flange.types.length - 1].id,
				// 	// title: flange.types[flange.types.length - 1].title,
				// 	// code: flange.types[flange.types.length - 1].code,
				// 	type: flange.types[flange.types.length - 1],
				// }
				// dispatch(setMainSnpType(type))
			}

			// if (data.data.materials?.rotaryPlug) dispatch(setMaterials(data.data.materials))
			// if (data.data.fillers?.length) {
			dispatch(setFiller(data.data.fillers || []))
			// }
		}
	}, [data])

	const gasketHandler = (type: string) => {
		const configuration = configurations.find(s => s.code === type)
		if (!configuration) return
		dispatch(setMainConfiguration(configuration))
	}

	const flangeStandardHandler = (event: SelectChangeEvent<string>) => {
		const standard = standards.find(s => s.id === event.target.value)
		if (!standard) return
		dispatch(setMainStandard(standard))
	}

	const flangeTypeHandler = (event: SelectChangeEvent<string>) => {
		const flangeType = flangeTypes.find(f => f.code === event.target.value)
		if (!flangeType) return
		dispatch(setMainFlangeType(flangeType))
	}

	return (
		<MainContainer rowEnd={5}>
			{/* {!data || !standards || isLoading || isLoadingStandards ? ( */}
			{false ? (
				<Column>
					{/* {isError || isErrorStandards ? ( */}
					{true ? (
						<Typography variant='h6' color={'error'} align='center'>
							Не удалось загрузить стандарты на фланец или конфигурации
						</Typography>
					) : (
						<Loader background='fill' />
					)}
				</Column>
			) : (
				<Column>
					<Typography fontWeight='bold'>Конфигурация прокладки</Typography>
					<RadioGroup onChange={gasketHandler}>
						{configurations.map(c => (
							<RadioItem key={c.id} value={c.code} active={c.code == main.configuration?.code}>
								{c.title}
							</RadioItem>
						))}
					</RadioGroup>

					{main.configuration?.hasStandard && (
						<>
							<Typography fontWeight='bold' mt={1}>
								Стандарт на прокладку / стандарт на фланец
							</Typography>
							<Select
								value={main.standard?.id || 'not_selected'}
								onChange={flangeStandardHandler}
								disabled={Boolean(positionId)}
								size='small'
								sx={{ borderRadius: '12px' }}
							>
								<MenuItem disabled value='not_selected'>
									Выберите стандарт
								</MenuItem>
								{standards?.map(s => (
									<MenuItem key={s.id} value={s.id}>
										{s.standard.title} {s.flangeStandard.title && '/'} {s.flangeStandard.title}
									</MenuItem>
								))}
							</Select>
						</>
					)}

					<Typography fontWeight='bold' mt={1}>
						Тип фланца
					</Typography>
					<Select
						value={main.flangeType?.code || 'not_selected'}
						onChange={flangeTypeHandler}
						disabled={Boolean(positionId)}
						size='small'
						sx={{ borderRadius: '12px' }}
					>
						<MenuItem disabled value='not_selected'>
							Выберите тип фланца
						</MenuItem>
						{flangeTypes.map(f => (
							<MenuItem key={f.id} value={f.code}>
								{f.title}
							</MenuItem>
						))}
					</Select>
				</Column>
			)}

			<Column>
				<Typography fontWeight='bold'>Чертеж фланца с прокладкой</Typography>
				{main.flangeType?.code == 'not_selected' ? (
					<PlugImage />
				) : (
					<Image
						src={images[main.flangeType?.code as 'А']}
						alt='flange drawing'
						maxWidth={'450px'}
						width={450}
						height={239}
					/>
				)}
			</Column>
		</MainContainer>
	)
}

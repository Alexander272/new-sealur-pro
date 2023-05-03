import { FC, useEffect } from 'react'
import { MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'
import {
	setConstruction,
	setFiller,
	setMainConfiguration,
	setMainFlangeType,
	setMainStandard,
	setMaterialFiller,
	setMaterials,
	setMounting,
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

	const dispatch = useAppDispatch()

	const { data: base, isError: isErrorBase, isLoading: isLoadingBase } = useGetPutgBaseQuery(null)

	const { data, isError, isLoading } = useGetPutgDataQuery(
		{
			standardId: main.flangeStandard?.id || '',
			constructionId: material.construction?.id || '',
			configuration: main.configuration?.code || '',
		},
		{ skip: !main.flangeStandard?.id || !material.construction?.id }
	)

	useEffect(() => {
		if (base) {
			if (base.data.configurations) dispatch(setMainConfiguration(base.data.configurations[0]))
			if (base.data.standards) dispatch(setMainStandard(base.data.standards[0]))
			if (base.data.constructions) dispatch(setConstruction(base.data.constructions[0]))
			if (base.data.mounting) dispatch(setMounting(base.data.mounting))
		}
	}, [base?.data])

	useEffect(() => {
		if (data?.data) {
			if (positionId === undefined) {
				const flange = data.data.flangeTypes[0]
				dispatch(setMainFlangeType({ code: flange.code, title: flange.title }))

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

			if (data.data.materials?.rotaryPlug) dispatch(setMaterials(data.data.materials))
			// if (data.data.fillers?.length) {
			dispatch(setFiller(data.data.fillers || []))
			// }
		}
	}, [data])

	// useEffect(() => {
	// if (res.data) {
	// 	if (positionId === undefined) {
	// 		const flange = data.flangeTypes[data.flangeTypes.length - 1]
	// 		dispatch(setMainFlangeType({ code: flange.code, title: flange.title }))
	// 		// const type = {
	// 		// 	id: flange.types[flange.types.length - 1].id,
	// 		// 	// title: flange.types[flange.types.length - 1].title,
	// 		// 	// code: flange.types[flange.types.length - 1].code,
	// 		// 	type: flange.types[flange.types.length - 1],
	// 		// }
	// 		// dispatch(setMainSnpType(type))
	// 	}

	// 	// dispatch(setMaterials(data.data.materials))
	// 	// if (data.data.mounting?.length) {
	// 	// 	dispatch(setMounting(data.data.mounting))
	// 	// }
	// }
	// }, [res?.data])

	const gasketHandler = (type: string) => {
		const configuration = base?.data.configurations.find(s => s.code === type)
		if (!configuration) return
		dispatch(setMainConfiguration(configuration))
	}

	const flangeStandardHandler = (event: SelectChangeEvent<string>) => {
		const standard = base?.data.standards.find(s => s.id === event.target.value)
		if (!standard) return
		dispatch(setMainStandard(standard))
	}

	const flangeTypeHandler = (event: SelectChangeEvent<string>) => {
		const flangeType = data?.data.flangeTypes.find(f => f.code === event.target.value)
		if (!flangeType) return
		dispatch(setMainFlangeType({ code: event.target.value, title: flangeType.title }))
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
						{base?.data.configurations.map(c => (
							<RadioItem key={c.id} value={c.code} active={c.code == main.configuration?.code}>
								{c.title}
							</RadioItem>
						))}
						{/* <RadioItem value='round' active={true}>
							Круглая
						</RadioItem>
						<RadioItem value='oval' active={false}>
							Овальная
						</RadioItem>
						<RadioItem value='rectangular' active={false}>
							Прямоугольная
						</RadioItem> */}
					</RadioGroup>

					{main.configuration?.hasStandard && (
						<>
							<Typography fontWeight='bold' mt={1}>
								Стандарт на фланец
							</Typography>
							<Select
								value={main.flangeStandard?.id || 'not_selected'}
								onChange={flangeStandardHandler}
								disabled={Boolean(positionId)}
								size='small'
								sx={{ borderRadius: '12px' }}
							>
								<MenuItem disabled value='not_selected'>
									Выберите стандарт
								</MenuItem>
								{base?.data.standards?.map(s => (
									<MenuItem key={s.id} value={s.id}>
										{s.title}
									</MenuItem>
								))}
							</Select>
						</>
					)}

					<Typography fontWeight='bold' mt={1}>
						Тип фланца
					</Typography>
					<Select
						value={main.flangeTypeCode || 'not_selected'}
						onChange={flangeTypeHandler}
						disabled={Boolean(positionId)}
						size='small'
						sx={{ borderRadius: '12px' }}
					>
						<MenuItem disabled value='not_selected'>
							Выберите тип фланца
						</MenuItem>
						{data?.data.flangeTypes.map(f => (
							<MenuItem key={f.id} value={f.code}>
								{f.title}
							</MenuItem>
						))}
					</Select>
				</Column>
			)}

			<Column>
				<Typography fontWeight='bold'>Чертеж фланца с прокладкой</Typography>
				{main.flangeTypeCode == 'not_selected' ? (
					<PlugImage />
				) : (
					<Image
						src={images[main.flangeTypeCode as 'А']}
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

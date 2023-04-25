import { FC, useEffect } from 'react'
import { MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'
import { setMainConfiguration, setMainFlangeType, setMainStandard } from '@/store/gaskets/putg'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { Loader } from '@/components/Loader/Loader'
import { IFlangeStandard, IGasketConfiguration } from '@/types/putg'
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

const data = {
	gasketConfiguration: [
		{ id: '1', title: 'Круглая', code: 'round', hasStandard: true },
		{ id: '2', title: 'Овальная', code: 'oval', hasDrawing: true },
		{ id: '3', title: 'Прямоугольная', code: 'rectangular' },
	] as IGasketConfiguration[],
	flangeStandard: [
		{ id: '1', title: 'ГОСТ 33259', code: 'gost_33259' },
		{ id: '2', title: 'ГОСТ 28759.3', code: 'gost_28759' },
	] as IFlangeStandard[],
	flangeTypes: [{ id: '1', title: 'соединительный выступ', code: 'А' }],
}

export const Main: FC<Props> = () => {
	const main = useAppSelector(state => state.putg.main)
	const positionId = useAppSelector(state => state.snp.positionId)

	const dispatch = useAppDispatch()

	useEffect(() => {
		if (data.gasketConfiguration) dispatch(setMainConfiguration(data.gasketConfiguration[0]))
		if (data.flangeStandard) dispatch(setMainStandard(data.flangeStandard[0]))
	}, [data.flangeStandard, data.gasketConfiguration])

	useEffect(() => {
		if (data) {
			if (positionId === undefined) {
				const flange = data.flangeTypes[data.flangeTypes.length - 1]
				dispatch(setMainFlangeType({ code: flange.code, title: flange.title }))
				// const type = {
				// 	id: flange.types[flange.types.length - 1].id,
				// 	// title: flange.types[flange.types.length - 1].title,
				// 	// code: flange.types[flange.types.length - 1].code,
				// 	type: flange.types[flange.types.length - 1],
				// }
				// dispatch(setMainSnpType(type))
			}

			// dispatch(setMaterials(data.data.materials))
			// if (data.data.mounting?.length) {
			// 	dispatch(setMounting(data.data.mounting))
			// }
		}
	}, [data])

	const gasketHandler = (type: string) => {
		const configuration = data?.gasketConfiguration.find(s => s.code === type)
		if (!configuration) return
		dispatch(setMainConfiguration(configuration))
	}

	const flangeStandardHandler = (event: SelectChangeEvent<string>) => {
		const standard = data?.flangeStandard.find(s => s.id === event.target.value)
		if (!standard) return
		dispatch(setMainStandard(standard))
	}

	const flangeTypeHandler = (event: SelectChangeEvent<string>) => {
		const flangeType = data.flangeTypes.find(f => f.code === event.target.value)
		if (!flangeType) return
		dispatch(setMainFlangeType({ code: event.target.value, title: flangeType.title }))
	}

	return (
		<MainContainer>
			{/* {!data || !standards || isLoading || isLoadingStandards ? ( */}
			{false ? (
				<Column>
					{/* {isError || isErrorStandards ? ( */}
					{true ? (
						<Typography variant='h6' color={'error'} align='center'>
							Не удалось загрузить стандарты на фланец ил конфигурации
						</Typography>
					) : (
						<Loader background='fill' />
					)}
				</Column>
			) : (
				<Column>
					<Typography fontWeight='bold'>Конфигурация прокладки</Typography>
					<RadioGroup onChange={gasketHandler}>
						{data.gasketConfiguration.map(c => (
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
							<Typography fontWeight='bold'>Стандарт на фланец</Typography>
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
								{data.flangeStandard?.map(s => (
									<MenuItem key={s.id} value={s.id}>
										{s.title}
									</MenuItem>
								))}
							</Select>
						</>
					)}

					<Typography fontWeight='bold'>Тип фланца</Typography>
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
						{data.flangeTypes.map(f => (
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

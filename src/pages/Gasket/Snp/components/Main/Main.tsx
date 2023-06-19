import { FC, useEffect } from 'react'
import { FormControl, MenuItem, Select, SelectChangeEvent, Skeleton, Typography } from '@mui/material'
import { MainContainer, Column, Image } from '@/pages/Gasket/gasket.style'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import {
	setFiller,
	setMainFlangeType,
	setMainSnpType,
	setMainStandard,
	setMaterials,
	setMounting,
} from '@/store/gaskets/snp'
import { useGetSnpDataQuery, useGetStandardForSNPQuery } from '@/store/api/snp'
import { RadioGroup, RadioItem } from '@/components/RadioGroup/RadioGroup'
import { MainSkeleton } from '@/pages/Gasket/Skeletons/MainSkeleton'

import FlangeA from '@/assets/snp/A.webp'
import FlangeB from '@/assets/snp/B.webp'
import FlangeV from '@/assets/snp/V.webp'
import FlangeG from '@/assets/snp/G.webp'
import FlangeD from '@/assets/snp/D.webp'

const images = {
	// А: FlangeA,
	// Б: FlangeB,
	// В: FlangeV,
	// 'В (STG)': FlangeV,
	// 'В (LTG)': FlangeV,
	А: FlangeA,
	'Б-А': FlangeB,
	'Б-Б': FlangeB,
	'Б-В': FlangeV,
	Г: FlangeG,
	Д: FlangeD,
}

type Props = {}

// часть со стандартами, типами фланцев и типами снп
export const Main: FC<Props> = () => {
	const isReady = useAppSelector(state => state.snp.isReady)

	const main = useAppSelector(state => state.snp.main)
	const positionId = useAppSelector(state => state.card.activePosition?.id)

	const {
		data: standards,
		isError: isErrorStandards,
		isFetching: isFetchingStandards,
	} = useGetStandardForSNPQuery(null)

	const { data, isError, isFetching } = useGetSnpDataQuery({
		standardId: main.snpStandard?.standard.id || '',
		snpStandardId: main.snpStandardId,
	})

	const dispatch = useAppDispatch()

	useEffect(() => {
		if (standards) dispatch(setMainStandard({ id: standards.data[0].id, standard: standards.data[0] }))
	}, [standards])

	useEffect(() => {
		if (data) {
			if (positionId === undefined) {
				const flange = data.data.flangeTypes[data.data.flangeTypes.length - 1]
				dispatch(setMainFlangeType({ code: flange.code, title: flange.title }))
				const type = {
					id: flange.types[flange.types.length - 1].id,
					type: flange.types[flange.types.length - 1],
				}
				dispatch(setMainSnpType(type))
			}

			dispatch(setMaterials({ material: data.data.materials, positionId }))
			if (data.data.fillers?.length) {
				dispatch(setFiller({ fillers: data.data.fillers, positionId }))
			}
			if (data.data.mounting?.length) {
				dispatch(setMounting({ mountings: data.data.mounting, positionId }))
			}
		}
	}, [data])

	const snpStandardHandler = (event: SelectChangeEvent<string>) => {
		const standard = standards?.data.find(s => s.id === event.target.value)
		if (!standard) return
		dispatch(setMainStandard({ id: standard.id, standard: standard }))
	}

	const flangeTypeHandler = (event: SelectChangeEvent<string>) => {
		const flangeType = data?.data.flangeTypes.find(f => f.code === event.target.value)
		if (!flangeType) return

		const type = {
			id: flangeType.types[flangeType.types.length - 1].id,
			type: flangeType.types[flangeType.types.length - 1],
		}
		dispatch(setMainSnpType(type))
		dispatch(setMainFlangeType({ code: event.target.value, title: flangeType.title }))
	}

	const typeHandlerNew = (type: string) => {
		let flangeType = data?.data.flangeTypes.find(
			f => f.code == main.flangeTypeCode && f.types.some(t => t.title === type)
		)
		if (!flangeType) {
			flangeType = data?.data.flangeTypes.find(f => f.types.some(t => t.title === type))
		}

		if (!flangeType) return

		if (flangeType.code != main.flangeTypeCode)
			dispatch(setMainFlangeType({ code: flangeType.code, title: flangeType.title }))

		const newType = flangeType.types.find(t => t.title === type)
		dispatch(setMainSnpType({ id: newType!.id, type: newType! }))
	}

	const renderTypes = () => {
		const set = new Set<string>()
		let flangeType = data?.data.flangeTypes[0]
		data?.data.flangeTypes.forEach(f => {
			f.types.forEach(t => set.add(t.title))
			if (f.code == main.flangeTypeCode) flangeType = f
		})

		const types: string[] = []
		set.forEach(t => types.push(t))

		console.log(flangeType)

		return types.map(t => (
			<RadioItem
				key={t}
				value={t}
				active={t === main.snpType?.title}
				disabled={!flangeType?.types.some(type => type.title == t)}
			>
				{t}
			</RadioItem>
		))
	}

	if (!isReady) {
		return (
			<MainContainer>
				<MainSkeleton />
				<Column>
					<Skeleton animation='wave' />
					<Skeleton animation='wave' variant='rounded' width={'100%'} height={222} />
				</Column>
			</MainContainer>
		)
	}

	return (
		<MainContainer>
			{isError || isErrorStandards ? (
				<Column>
					<Typography variant='h6' color={'error'} align='center'>
						Не удалось загрузить стандарты или типы фланца и снп
					</Typography>
				</Column>
			) : null}

			{data && standards ? (
				<Column>
					<Typography fontWeight='bold'>Стандарт на прокладку / стандарт на фланец</Typography>
					<FormControl size='small'>
						<Select
							value={main.snpStandardId || 'not_selected'}
							onChange={snpStandardHandler}
							sx={{ borderRadius: '12px' }}
							disabled={Boolean(positionId) || isFetching || isFetchingStandards}
						>
							<MenuItem disabled value='not_selected'>
								Выберите стандарт
							</MenuItem>
							{standards?.data.map(s => (
								<MenuItem key={s.id} value={s.id}>
									{s.standard.title} {s.flangeStandard.title && '/'} {s.flangeStandard.title}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<Typography fontWeight='bold'>Тип фланца</Typography>
					<Select
						value={main.flangeTypeCode || 'not_selected'}
						onChange={flangeTypeHandler}
						size='small'
						sx={{ borderRadius: '12px' }}
						disabled={Boolean(positionId) || isFetching || isFetchingStandards}
					>
						<MenuItem disabled value='not_selected'>
							Выберите тип фланца
						</MenuItem>
						{[...(data?.data.flangeTypes || [])].reverse().map(f => (
							<MenuItem key={f.id} value={f.code}>
								{f.title} {f.description && `(${f.description})`}
							</MenuItem>
						))}
					</Select>

					<Typography fontWeight='bold'>Тип СНП</Typography>
					<RadioGroup
						onChange={typeHandlerNew}
						disabled={Boolean(positionId) || isFetching || isFetchingStandards}
					>
						{renderTypes()}
					</RadioGroup>
				</Column>
			) : null}
			<Column>
				<Typography fontWeight='bold'>Чертеж фланца с прокладкой</Typography>
				{main.snpType?.title == 'not_selected' ? (
					<Skeleton animation='wave' variant='rounded' width={'100%'} height={222} />
				) : (
					<Image
						src={
							images[
								`${main.flangeTypeCode == 'Б' ? main.flangeTypeCode + '-' : ''}${
									main.snpType?.title
								}` as 'А'
							]
						}
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

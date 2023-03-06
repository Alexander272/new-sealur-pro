import { FC, useEffect } from 'react'
import { FormControl, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'
import { MainContainer, Column, PlugImage, Image } from '@/pages/Gasket/gasket.style'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import {
	setFiller,
	setMainFlangeType,
	setMainSnpType,
	setMainStandard,
	setMaterials,
	setMounting,
} from '@/store/gaskets/snp'
import { useGetSnpDataQuery, useGetStandardForSNPQuery } from '@/store/api'
import { RadioGroup, RadioItem } from '@/components/RadioGroup/RadioGroup'
import FlangeA from '@/assets/snp/A.webp'
import FlangeB from '@/assets/snp/B.webp'
import FlangeV from '@/assets/snp/V.webp'
import { Input } from '@/components/Input/input.style'

type Props = {}

const images = {
	А: FlangeA,
	Б: FlangeB,
	В: FlangeV,
}

export const Main: FC<Props> = () => {
	const main = useAppSelector(state => state.snp.main)

	const { data: standards } = useGetStandardForSNPQuery(null)
	const { data } = useGetSnpDataQuery({
		standardId: main.snpStandard?.standard.id || '',
		snpStandardId: main.snpStandardId,
	})

	const dispatch = useAppDispatch()

	useEffect(() => {
		if (standards) dispatch(setMainStandard({ id: standards.data[0].id, standard: standards.data[0] }))
	}, [standards])

	useEffect(() => {
		if (data) {
			const flange = data.data.flangeTypes[data.data.flangeTypes.length - 1]
			dispatch(setMainFlangeType({ code: flange.code, title: flange.title }))
			const type = {
				id: flange.types[flange.types.length - 1].id,
				title: flange.types[flange.types.length - 1].title,
				code: flange.types[flange.types.length - 1].code,
			}
			dispatch(setMainSnpType(type))

			dispatch(setMaterials(data.data.materials))
			if (data.data.fillers?.length) {
				dispatch(setFiller(data.data.fillers))
			}
			if (data.data.mounting?.length) {
				dispatch(setMounting(data.data.mounting))
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
		// flangeType.title
		const type = {
			id: flangeType.types[flangeType.types.length - 1].id,
			title: flangeType.types[flangeType.types.length - 1].title,
			code: flangeType.types[flangeType.types.length - 1].code,
		}
		dispatch(setMainSnpType(type))
		dispatch(setMainFlangeType({ code: event.target.value, title: flangeType.title }))
	}
	const typeHandler = (typeId: string) => {
		const flangeType = data?.data.flangeTypes.find(f => f.types.some(t => t.id === typeId))
		if (!flangeType) return

		if (flangeType.code != main.flangeTypeCode)
			dispatch(setMainFlangeType({ code: flangeType.code, title: flangeType.title }))
		const type = flangeType.types.find(t => t.id === typeId)
		dispatch(setMainSnpType({ id: typeId, title: type!.title, code: type!.code }))
	}

	return (
		<MainContainer>
			<Column>
				<Typography fontWeight='bold'>Стандарт на прокладку / стандарт на фланец</Typography>
				<FormControl size='small'>
					<Select
						value={main.snpStandardId || 'not_selected'}
						onChange={snpStandardHandler}
						// input={<Input />}
						sx={{ borderRadius: '12px' }}
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
				>
					<MenuItem disabled value='not_selected'>
						Выберите тип фланца
					</MenuItem>
					{[...(data?.data.flangeTypes || [])].reverse().map(f => (
						<MenuItem key={f.id} value={f.code}>
							{f.code} {f.title} {f.description}
						</MenuItem>
					))}
				</Select>

				<Typography fontWeight='bold'>Тип СНП</Typography>
				<RadioGroup onChange={typeHandler}>
					{data?.data.flangeTypes.map(f =>
						f.types.map(t => (
							<RadioItem key={t.id} value={t.id} active={t.id === main.snpTypeId}>
								{t.title}
							</RadioItem>
						))
					)}
				</RadioGroup>
			</Column>
			<Column>
				<Typography fontWeight='bold'>Чертеж фланца с прокладкой</Typography>
				{/* <PlugImage /> */}
				{main.flangeTypeCode == 'not_selected' ? (
					<PlugImage />
				) : (
					<Image src={images[main.flangeTypeCode as 'А']} alt='flange drawing' />
				)}
			</Column>
		</MainContainer>
	)
}

import { FC, useEffect } from 'react'
import { MenuItem, Select, SelectChangeEvent, Skeleton, Typography } from '@mui/material'
import {
	setConfigurations,
	setConstruction,
	setFiller,
	setFlangeTypes,
	setMainConfiguration,
	setMainFlangeType,
	setMainStandard,
	setMaterials,
	setStandards,
	setType,
} from '@/store/gaskets/putg'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { useGetPutgBaseQuery, useGetPutgQuery } from '@/store/api/putg'
import { RadioGroup, RadioItem } from '@/components/RadioGroup/RadioGroup'
import { Column, Image, MainContainer, PlugImage } from '@/pages/Gasket/gasket.style'
import { MainSkeleton } from '@/pages/Gasket/Skeletons/MainSkeleton'

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
	const isReady = useAppSelector(state => state.putg.isReady)

	const main = useAppSelector(state => state.putg.main)
	const material = useAppSelector(state => state.putg.material)

	const standards = useAppSelector(state => state.putg.standards)
	const configurations = useAppSelector(state => state.putg.configurations)
	const flangeTypes = useAppSelector(state => state.putg.flangeTypes)

	const positionId = useAppSelector(state => state.card.activePosition?.id)

	const dispatch = useAppDispatch()

	const {
		data: base,
		isError: isErrorBase,
		isFetching: isFetchingBase,
	} = useGetPutgBaseQuery({ standardId: main.standard?.id || '', empty: !standards.length })

	const {
		data: putg,
		isError: isErrorPutg,
		isFetching: isFetchingPutg,
	} = useGetPutgQuery(
		{
			fillerId: material.filler?.id || '',
			baseId: material.filler?.baseId || '',
			flangeTypeId: main.flangeType?.id || '',
		},
		{ skip: !material.filler || !main.flangeType?.id }
	)

	useEffect(() => {
		if (base) {
			if (base.data.configurations) dispatch(setConfigurations(base.data.configurations))
			if (base.data.standards) dispatch(setStandards(base.data.standards))
			// if (base.data.mounting) dispatch(setMounting({ mountings: base.data.mounting, positionId }))

			if (base.data.materials?.rotaryPlug) dispatch(setMaterials(base.data.materials))
			if (base.data.flangeTypes) dispatch(setFlangeTypes({ types: base.data.flangeTypes, positionId }))
			if (base?.data.fillers) dispatch(setFiller({ fillers: base.data.fillers || [], positionId }))
		}
	}, [base?.data])

	useEffect(() => {
		if (!positionId) {
			if (putg?.data.putgTypes) dispatch(setType(putg.data.putgTypes[0]))
			if (putg?.data.constructions) dispatch(setConstruction(putg.data.constructions[0]))
		}
	}, [putg])

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

	const typeHandler = (event: SelectChangeEvent<string>) => {
		const type = putg?.data.putgTypes.find(s => s.code === event.target.value)
		if (!type) return
		dispatch(setType(type))
	}

	const constructionHandler = (event: SelectChangeEvent<string>) => {
		const construction = putg?.data.constructions.find(s => s.code === event.target.value)
		if (!construction) return
		dispatch(setConstruction(construction))
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
			{(isErrorBase || isErrorPutg) && (
				<Column>
					<Typography variant='h6' color={'error'} align='center'>
						Не удалось загрузить стандарты на фланец или конфигурации
					</Typography>
				</Column>
			)}

			{!isErrorBase && base ? (
				<Column>
					<Typography fontWeight='bold'>Конфигурация прокладки</Typography>
					<RadioGroup onChange={gasketHandler} disabled={Boolean(positionId) || isFetchingBase}>
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
								disabled={Boolean(positionId) || isFetchingBase}
								size='small'
								sx={{ borderRadius: '12px' }}
							>
								{/* <MenuItem disabled value='not_selected'>
									Выберите стандарт
								</MenuItem> */}
								<MenuItem disabled value='not_selected'>
									<Typography
										sx={{
											display: 'flex',
											overflow: 'hidden',
											textOverflow: 'ellipsis',
											width: '100%',
											gap: '2%',
										}}
									>
										<Typography variant='body1' component='span' sx={{ flexBasis: '54%' }}>
											Стандарт на прокладку
										</Typography>
										<Typography
											variant='body1'
											component='span'
											sx={{ flexBasis: '44%', overflow: 'hidden', textOverflow: 'ellipsis' }}
										>
											Стандарт на фланец
										</Typography>
									</Typography>
								</MenuItem>
								{standards?.map(s => (
									<MenuItem key={s.id} value={s.id}>
										<Typography
											sx={{
												display: 'flex',
												overflow: 'hidden',
												textOverflow: 'ellipsis',
												width: '100%',
												gap: '2%',
											}}
										>
											<Typography
												variant='body1'
												component='span'
												sx={{ flexBasis: '54%', overflow: 'hidden', textOverflow: 'ellipsis' }}
											>
												{s.standard.title}
											</Typography>
											<Typography
												variant='body1'
												component='span'
												sx={{ flexBasis: '44%', overflow: 'hidden', textOverflow: 'ellipsis' }}
											>
												{s.flangeStandard.title}
											</Typography>
										</Typography>

										{/* {s.standard.title} {s.flangeStandard.title && '/'} {s.flangeStandard.title} */}
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
						disabled={Boolean(positionId) || isFetchingBase}
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

					<Typography fontWeight='bold' mt={1}>
						Тип прокладки
					</Typography>
					<Select
						value={material.putgType?.code || 'not_selected'}
						onChange={typeHandler}
						disabled={isFetchingPutg}
						size='small'
						sx={{
							borderRadius: '12px',
							width: '100%',
						}}
					>
						<MenuItem disabled value='not_selected'>
							Выберите тип прокладки
						</MenuItem>
						{putg?.data.putgTypes.map(f => (
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
						disabled={isFetchingPutg}
						size='small'
						sx={{
							borderRadius: '12px',
							width: '100%',
						}}
					>
						<MenuItem disabled value='not_selected'>
							Выберите тип конструкции
						</MenuItem>
						{putg?.data.constructions.map(f => (
							<MenuItem key={f.id} value={f.code}>
								{f.code} - {f.title}
							</MenuItem>
						))}
					</Select>
				</Column>
			) : null}

			<Column>
				<Typography fontWeight='bold'>Чертеж фланца с прокладкой</Typography>
				{!main.flangeType?.code ? (
					<Skeleton animation='wave' variant='rounded' width={'100%'} height={222} />
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

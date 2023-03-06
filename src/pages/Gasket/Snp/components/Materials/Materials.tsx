import React, { FC } from 'react'
import { MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { AsideContainer } from '@/pages/Gasket/gasket.style'
import { OpenMaterial } from '@/types/snp'
import { setMaterial, setMaterialFiller, setMaterialToggle } from '@/store/gaskets/snp'
import { useGetSnpQuery } from '@/store/api'

type Props = {}

export const Materials: FC<Props> = () => {
	const fillers = useAppSelector(state => state.snp.fillers)
	const materialIr = useAppSelector(state => state.snp.materialsIr)
	const materialFr = useAppSelector(state => state.snp.materialsFr)
	const materialOr = useAppSelector(state => state.snp.materialsOr)

	const material = useAppSelector(state => state.snp.material)

	const main = useAppSelector(state => state.snp.main)

	const dispatch = useAppDispatch()

	const { data } = useGetSnpQuery(
		{ typeId: main.snpTypeId, hasD2: main.snpStandard?.hasD2 },
		{ skip: main.snpTypeId == 'not_selected' }
	)

	const openHandler = (type: OpenMaterial) => () => {
		dispatch(setMaterialToggle({ type, isOpen: true }))
	}
	const closeHandler = (type: OpenMaterial) => () => {
		dispatch(setMaterialToggle({ type, isOpen: false }))
	}

	const fillerHandler = (event: SelectChangeEvent<string>) => {
		const filler = fillers.find(f => f.id === event.target.value)
		if (!filler) return
		dispatch(setMaterialFiller(filler))
	}
	const materialIrHandler = (event: SelectChangeEvent<string>) => {
		const material = materialIr?.materials.find(f => f.id === event.target.value)
		if (!material) return
		dispatch(setMaterial({ type: 'ir', material }))
		dispatch(setMaterial({ type: 'fr', material }))
	}
	const materialFrHandler = (event: SelectChangeEvent<string>) => {
		const material = materialFr?.materials.find(f => f.id === event.target.value)
		if (!material) return
		dispatch(setMaterial({ type: 'fr', material }))
	}
	const materialOrHandler = (event: SelectChangeEvent<string>) => {
		const material = materialOr?.materials.find(f => f.id === event.target.value)
		if (!material) return
		dispatch(setMaterial({ type: 'or', material }))
	}

	return (
		<AsideContainer>
			<Typography fontWeight='bold'>Тип наполнителя</Typography>
			<Select
				value={material.filler?.id || 'not_selected'}
				onChange={fillerHandler}
				onOpen={openHandler('filler')}
				onClose={closeHandler('filler')}
				size='small'
				sx={{ borderColor: 'var(--border-color)', borderWidth: '2px', borderRadius: '12px', width: '100%' }}
			>
				<MenuItem value='not_selected'>Выберите тип наполнителя</MenuItem>
				{fillers?.map(f => (
					<MenuItem key={f.id} value={f.id}>
						{f.title} - {f.anotherTitle} ({f.description} {f.description && ', '} {f.temperature})
					</MenuItem>
				))}
			</Select>

			{materialIr ? (
				<>
					<Typography fontWeight='bold' mt={1}>
						Материал внутреннего кольца
					</Typography>
					<Select
						value={material.ir?.id || 'not_selected'}
						onChange={materialIrHandler}
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
						{materialIr.materials.map(m => (
							<MenuItem key={m.id} value={m.id}>
								{m.title}
							</MenuItem>
						))}
					</Select>
				</>
			) : null}

			{materialFr ? (
				<>
					<Typography fontWeight='bold' mt={1}>
						Материал каркаса
					</Typography>
					<Select
						value={material.fr?.id || 'not_selected'}
						onChange={materialFrHandler}
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
						{materialFr.materials.map(m => (
							<MenuItem key={m.id} value={m.id}>
								{m.title}
							</MenuItem>
						))}
					</Select>
				</>
			) : null}

			{materialOr ? (
				<>
					<Typography fontWeight='bold' mt={1}>
						Материал наружного кольца
					</Typography>
					<Select
						value={material.or?.id || 'not_selected'}
						onChange={materialOrHandler}
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
						{materialOr.materials.map(m => (
							<MenuItem key={m.id} value={m.id}>
								{m.title}
							</MenuItem>
						))}
					</Select>
				</>
			) : null}
		</AsideContainer>
	)
}

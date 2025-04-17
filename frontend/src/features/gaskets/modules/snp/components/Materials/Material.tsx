import { FC, useEffect } from 'react'
import { MenuItem, Select, SelectChangeEvent, Skeleton, Typography } from '@mui/material'

import type { TypeMaterial } from '../../types/material'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getActive } from '@/features/card/cardSlice'
import { useGetSnpMaterialsQuery } from '../../snpApiSlice'
import { getMaterials, getStandard, setMaterial, setMaterialToggle } from '../../snpSlice'

type Props = {
	title: string
	type: TypeMaterial
	disabled?: boolean
	isEmpty?: boolean
}

export const Material: FC<Props> = ({ title, type, disabled, isEmpty }) => {
	const active = useAppSelector(getActive)
	const standard = useAppSelector(getStandard)
	const material = useAppSelector(getMaterials)

	const dispatch = useAppDispatch()

	const { data, isFetching, isUninitialized } = useGetSnpMaterialsQuery(standard?.standard.id || '', {
		skip: !standard,
	})

	useEffect(() => {
		if (!data || isFetching || !active) return
		const found = data.data[type].find(m => m.id === material?.[type]?.id)
		if (found) dispatch(setMaterial({ type, material: found }))
	}, [active, data, dispatch, material, type, isFetching])

	useEffect(() => {
		if (!data || active) return
		const key = `${type}DefaultIndex` as const
		if (data.data[type].length > 0) {
			const index = data.data[key] || 0
			dispatch(setMaterial({ type, material: data.data[type][index] }))
		}
	}, [data, active, dispatch, type])

	useEffect(() => {
		if (active) return
		if (isEmpty) dispatch(setMaterial({ type }))
		else if (data && !material?.[type]?.materialId) {
			const key = `${type}DefaultIndex` as const
			const index = data.data[key] || 0
			dispatch(setMaterial({ type, material: data.data[type][index] }))
		}
	}, [active, data, dispatch, isEmpty, material, type])

	const materialHandler = (event: SelectChangeEvent<string>) => {
		const current = data?.data?.[type].find(m => m.materialId === event.target.value)
		if (!current) return
		dispatch(setMaterial({ type, material: current }))
		if (type == 'frame' && material?.innerRing?.materialId) {
			const current = data?.data?.innerRing.find(m => m.materialId === event.target.value)
			dispatch(setMaterial({ type: 'innerRing', material: current }))
		}
	}

	const openHandler = () => {
		dispatch(setMaterialToggle({ type, isOpen: true }))
	}
	const closeHandler = () => {
		dispatch(setMaterialToggle({ type, isOpen: false }))
	}

	return (
		<>
			<Typography fontWeight='bold' mt={1}>
				{title}
			</Typography>

			{isFetching || isUninitialized ? (
				<Skeleton animation='wave' variant='rounded' height={40} sx={{ borderRadius: 3 }} />
			) : (
				<Select
					value={material?.[type]?.materialId || 'not_selected'}
					onChange={materialHandler}
					onOpen={openHandler}
					onClose={closeHandler}
					disabled={disabled || isFetching}
					fullWidth
				>
					<MenuItem value='not_selected'>Выберите материал</MenuItem>

					{data?.data?.[type]?.map(m => (
						<MenuItem key={m.id} value={m.materialId}>
							{m.title}
						</MenuItem>
					))}
				</Select>
			)}
		</>
	)
}

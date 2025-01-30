import { FC, useEffect } from 'react'
import { MenuItem, Select, SelectChangeEvent, Skeleton, Typography } from '@mui/material'

import type { TypeMaterial } from '../../types/putg'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getMaterials, getStandard, setMaterial } from '../../putgSlice'
import { useGetPutgMaterialsQuery } from '../../putgApiSlice'

type Props = {
	title: string
	type: TypeMaterial
	disabled?: boolean
	isEmpty?: boolean
}

export const Material: FC<Props> = ({ title, type, disabled, isEmpty }) => {
	const standard = useAppSelector(getStandard)
	const material = useAppSelector(getMaterials)

	const dispatch = useAppDispatch()

	const { data, isFetching, isUninitialized } = useGetPutgMaterialsQuery(standard?.id || '', {
		skip: !standard,
	})

	useEffect(() => {
		const key = `${type}DefaultIndex` as const
		if (data && data.data[type]?.length > 0) {
			const index = data.data[key] || 0
			dispatch(setMaterial({ type, material: data.data[type][index] }))
		}
	}, [data, dispatch, type])
	useEffect(() => {
		if (isEmpty) dispatch(setMaterial({ type }))
		else if (data && !material?.[type]?.materialId) {
			const key = `${type}DefaultIndex` as const
			const index = data.data[key] || 0
			dispatch(setMaterial({ type, material: data.data[type][index] }))
		}
	}, [data, dispatch, isEmpty, material, type])

	const materialHandler = (event: SelectChangeEvent<string>) => {
		const current = data?.data?.[type].find(m => m.materialId === event.target.value)
		if (!current) return
		dispatch(setMaterial({ type, material: current }))
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

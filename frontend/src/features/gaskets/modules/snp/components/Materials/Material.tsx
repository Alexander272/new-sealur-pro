import { FC } from 'react'
import { MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'

import type { TypeMaterial } from '../../types/snp'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { useGetMaterialsQuery } from '../../snpApiSlice'
import { getMaterials, getStandard, setMaterial, setMaterialToggle } from '../../snpSlice'

type Props = {
	title: string
	type: TypeMaterial
	disabled?: boolean
}

export const Material: FC<Props> = ({ title, type, disabled }) => {
	const standard = useAppSelector(getStandard)
	const material = useAppSelector(getMaterials)

	const dispatch = useAppDispatch()

	const { data, isFetching } = useGetMaterialsQuery(standard?.standard.id || '', { skip: !standard })

	const materialHandler = (event: SelectChangeEvent<string>) => {
		const material = data?.data?.[type].find(m => m.materialId === event.target.value)
		if (!material) return
		dispatch(setMaterial({ type, material }))
		// if (type == 'frame' && data?.data.snp.hasInnerRing) dispatch(setMaterial({ type: 'innerRing', material }))
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
			<Select
				value={material?.[type]?.materialId || 'not_selected'}
				onChange={materialHandler}
				onOpen={openHandler}
				onClose={closeHandler}
				disabled={disabled || isFetching}
			>
				<MenuItem value='not_selected'>Выберите материал</MenuItem>

				{data?.data?.[type].map(m => (
					<MenuItem key={m.id} value={m.materialId}>
						{m.title}
					</MenuItem>
				))}
			</Select>
		</>
	)
}

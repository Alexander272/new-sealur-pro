import { MenuItem, Select, SelectChangeEvent, Skeleton, Typography } from '@mui/material'
import { toast } from 'react-toastify'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getFiller, getSnpTypeId, getStandard, setMaterialFiller, setMaterialToggle } from '../../snpSlice'
import { useGetFillersQuery } from '../../snpApiSlice'
import { useEffect } from 'react'

export const Filler = () => {
	const standard = useAppSelector(getStandard)
	const snp = useAppSelector(getSnpTypeId)
	const filler = useAppSelector(getFiller)

	const dispatch = useAppDispatch()

	const { data, isFetching, isUninitialized } = useGetFillersQuery(standard?.standard.id || '', { skip: !standard })

	useEffect(() => {
		if (data) dispatch(setMaterialFiller(data.data[0]))
	}, [data, dispatch])
	useEffect(() => {
		if (filler.disabledTypes?.includes(snp)) {
			if (data) dispatch(setMaterialFiller(data.data[0]))
		}
	}, [data, dispatch, filler.disabledTypes, snp])

	const openHandler = () => {
		dispatch(setMaterialToggle({ type: 'filler', isOpen: true }))
	}
	const closeHandler = () => {
		dispatch(setMaterialToggle({ type: 'filler', isOpen: false }))
	}

	const fillerHandler = (event: SelectChangeEvent<string>) => {
		const filler = data?.data.find(f => f.id === event.target.value)
		if (!filler) return

		if (filler.disabledTypes?.includes(snp)) {
			toast.error('Данный наполнитель не возможно выбрать с текущей конструкцией')
			// setAlert({ type: 'error', errType: 'filler', open: true })
			return
		}

		dispatch(setMaterialFiller(filler))
	}

	return (
		<>
			<Typography fontWeight='bold'>Тип наполнителя</Typography>

			{isFetching || isUninitialized ? (
				<Skeleton animation='wave' variant='rounded' height={40} sx={{ borderRadius: 3 }} />
			) : (
				<Select
					value={filler?.id || 'not_selected'}
					onChange={fillerHandler}
					onOpen={openHandler}
					onClose={closeHandler}
					disabled={data?.data.length == 1 || isFetching}
					fullWidth
				>
					<MenuItem value='not_selected'>Выберите тип наполнителя</MenuItem>

					{data?.data?.map(f => (
						<MenuItem key={f.id} value={f.id} sx={{ color: 'black' }}>
							{f.title} ({f.description} {f.description && ', '} {f.temperature})
						</MenuItem>
					))}
				</Select>
			)}
		</>
	)
}

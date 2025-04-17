import { useEffect } from 'react'
import { MenuItem, Select, SelectChangeEvent, Skeleton, Typography } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getActive } from '@/features/card/cardSlice'
import { useGetWaveDnQuery, useGetWaveTypesQuery } from '../../../waveApiSlice'
import { getDn, getFlangeType, getStandard, getType, setDn, setType } from '../../../waveSlice'

export const Dn = () => {
	const active = useAppSelector(getActive)
	const standard = useAppSelector(getStandard)
	const flange = useAppSelector(getFlangeType)
	const type = useAppSelector(getType)
	const dn = useAppSelector(getDn)
	const dispatch = useAppDispatch()

	const { data: types } = useGetWaveTypesQuery(flange?.id || '', { skip: !flange?.id })
	const { data, isFetching } = useGetWaveDnQuery(flange?.id || '', { skip: !flange?.id })

	useEffect(() => {
		if (!data || !type || active) return
		if (!dn) {
			dispatch(setDn(type.dnRange[0]))
			return
		}
		if (+dn < +(type?.dnRange[0] || 0) || +dn > +(type?.dnRange[1] || 0)) {
			dispatch(setDn(type.dnRange[0]))
		}
	}, [data, dn, type, active, dispatch])

	const dnHandler = (event: SelectChangeEvent) => {
		const newDn = event.target.value
		dispatch(setDn(newDn))

		if (+newDn > +(type?.dnRange[0] || 0) && +newDn < +(type?.dnRange[1] || 0)) return
		const newType = types?.data.find(f => +f.dnRange[0] <= +newDn && +f.dnRange[1] >= +newDn)
		if (newType) dispatch(setType(newType))
	}

	return (
		<>
			<Typography fontWeight='bold'>{standard?.dnTitle}</Typography>
			{isFetching ? (
				<Skeleton animation='wave' variant='rounded' height={40} sx={{ borderRadius: 3 }} />
			) : (
				<Select value={dn || 'not_selected'} onChange={dnHandler}>
					<MenuItem disabled value='not_selected'>
						Выберите значение
					</MenuItem>

					{data?.data.map(f => {
						let color = ''
						if (f.alt < +(type?.dnRange[0] || 0) || f.alt > +(type?.dnRange[1] || 0)) color = '#707070'

						return (
							<MenuItem
								key={f.dn}
								value={f.alt}
								sx={{
									color: color,
								}}
							>
								{f.dn} {f.dn != f.alt.toString() && `(${f.alt})`}
							</MenuItem>
						)
					})}
				</Select>
			)}
		</>
	)
}

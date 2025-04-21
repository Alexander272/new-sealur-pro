import { FC, useEffect } from 'react'
import { MenuItem, Select, SelectChangeEvent, Skeleton, Typography } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getActive } from '@/features/card/cardSlice'
import { useGetPutgDnQuery } from '../../../putgApiSlice'
import { getConstruction, getDn, getFiller, getFlangeType, getStandard, setDn } from '../../../putgSlice'

type Props = unknown

export const Dn: FC<Props> = () => {
	const active = useAppSelector(getActive)
	const standard = useAppSelector(getStandard)
	const construction = useAppSelector(getConstruction)
	const filler = useAppSelector(getFiller)
	const type = useAppSelector(getFlangeType)
	const dn = useAppSelector(getDn)
	const dispatch = useAppDispatch()

	const { data, isFetching } = useGetPutgDnQuery(
		{ filler: filler?.baseId || '', flangeType: type?.id || '', construction: construction?.baseId || '' },
		{ skip: !filler?.baseId || !type || !construction?.baseId }
	)

	useEffect(() => {
		if (!data || active) return
		dispatch(setDn({ dn: data.data[0].dn }))
	}, [data, active, dispatch])

	const dnHandler = (event: SelectChangeEvent<string>) => {
		dispatch(setDn({ dn: event.target.value }))
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

					{data?.data.map(f => (
						<MenuItem key={f.dn} value={f.dn}>
							{f.dn} {f.dn != f.alt.toString() && `(${f.alt})`}
						</MenuItem>
					))}
				</Select>
			)}
		</>
	)
}

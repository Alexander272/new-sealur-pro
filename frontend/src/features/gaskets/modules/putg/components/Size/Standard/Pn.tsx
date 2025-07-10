import { FC, useEffect } from 'react'
import { MenuItem, Select, SelectChangeEvent, Skeleton, Typography } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getConstruction, getDn, getFiller, getFlangeType, getPn, getStandard, setSize } from '../../../putgSlice'
import { useGetPutgSizesQuery } from '../../../putgApiSlice'

type Props = unknown

export const Pn: FC<Props> = () => {
	const standard = useAppSelector(getStandard)
	const construction = useAppSelector(getConstruction)
	const filler = useAppSelector(getFiller)
	const type = useAppSelector(getFlangeType)
	const dn = useAppSelector(getDn)
	const pn = useAppSelector(getPn)

	const dispatch = useAppDispatch()

	const { data, isFetching } = useGetPutgSizesQuery(
		{ filler: filler?.baseId || '', flangeType: type?.id || '', construction: construction?.baseId || '', dn: dn },
		{ skip: !filler?.baseId || !type || !construction?.baseId || !dn }
	)

	useEffect(() => {
		if (!data || data.data[0]?.dn != dn) return
		let idx = data.data.findIndex(s => s.pn === pn)
		if (idx == -1) idx = 0
		if (!data.data[idx]) return
		const newSize = {
			id: data.data[idx].id,
			dn: data.data[idx].dn,
			dnAlt: data.data[idx].dnAlt,
			pn: data.data[idx].pn,
			pnAlt: data.data[idx].pnAlt,
			d4: data.data[idx].d4,
			d3: data.data[idx].d3,
			d2: data.data[idx].d2,
			d1: data.data[idx].d1,
			h: data.data[idx].h[0] || '3,0',
			another: '',
		}
		dispatch(setSize(newSize))
	}, [data, dispatch, dn, pn])

	const pnHandler = (event: SelectChangeEvent<string>) => {
		if (!data) return

		const size = data.data.find(s => s.pn === event.target.value)
		if (size) {
			const newSize = {
				id: size.id,
				dn: size.dn,
				dnAlt: size.dnAlt,
				pn: size.pn,
				pnAlt: size.pnAlt,
				d4: size.d4,
				d3: size.d3,
				d2: size.d2,
				d1: size.d1,
				h: '3,0',
				another: '',
			}
			dispatch(setSize(newSize))
		}
	}

	return (
		<>
			<Typography fontWeight='bold'>{standard?.pnTitle}</Typography>
			{isFetching ? (
				<Skeleton animation='wave' variant='rounded' height={40} sx={{ borderRadius: 3 }} />
			) : (
				<Select value={pn || 'not_selected'} onChange={pnHandler}>
					<MenuItem disabled value='not_selected'>
						Выберите значение
					</MenuItem>

					{data?.data.map(d => (
						<MenuItem key={d.id} value={d.pn}>
							{d.pn} {d.pnAlt ? `(${d.pnAlt})` : ''}
						</MenuItem>
					))}
				</Select>
			)}
		</>
	)
}

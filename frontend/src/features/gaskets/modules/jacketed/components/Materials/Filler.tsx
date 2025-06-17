import { useCallback } from 'react'

import type { IFiller } from '../../types/material'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { BaseFiller } from '@/features/gaskets/components/materials/Filler'
import { getFiller, getStandard, setFiller } from '../../jacketedSlice'
import { useGetJacketedFillersQuery } from '../../jacketedApiSlice'

export const Filler = () => {
	const standard = useAppSelector(getStandard)
	const filler = useAppSelector(getFiller)
	const dispatch = useAppDispatch()

	const { data, isFetching } = useGetJacketedFillersQuery(standard?.id || '', { skip: !standard })

	const changeHandler = useCallback((value: IFiller) => dispatch(setFiller(value)), [dispatch])

	return <BaseFiller data={data?.data || []} isFetching={isFetching} value={filler?.id} onChange={changeHandler} />
}

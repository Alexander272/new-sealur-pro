import { useCallback } from 'react'

import type { IJacketedType } from '../../types/main'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { BaseGasket } from '@/features/gaskets/components/main/Gasket/Gasket'
import { getFlangeType, getType, setType } from '../../jacketedSlice'
import { useGetJacketedTypesQuery } from '../../jacketedApiSlice'

export const Gasket = () => {
	const flange = useAppSelector(getFlangeType)
	const type = useAppSelector(getType)
	const dispatch = useAppDispatch()

	const { data, isFetching } = useGetJacketedTypesQuery(flange?.id || '', { skip: !flange?.id })

	const changeHandler = useCallback((value: IJacketedType) => dispatch(setType(value)), [dispatch])

	return <BaseGasket data={data?.data || []} isFetching={isFetching} value={type?.id} onChange={changeHandler} />
}

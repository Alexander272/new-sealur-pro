import { useCallback } from 'react'

import type { IFlangeType } from '../../types/main'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { BaseFlangeType } from '@/features/gaskets/components/main/FlangeType/Flange'
import { getFlangeType, getStandard, setMainFlangeType } from '../../jacketedSlice'
import { useGetJacketedFlangeTypesQuery } from '../../jacketedApiSlice'

export const FlangeType = () => {
	const standard = useAppSelector(getStandard)
	const flange = useAppSelector(getFlangeType)
	const dispatch = useAppDispatch()

	const { data, isFetching } = useGetJacketedFlangeTypesQuery(standard?.id || '', {
		skip: !standard,
	})

	const changeHandler = useCallback((value: IFlangeType) => dispatch(setMainFlangeType(value)), [dispatch])

	return (
		<BaseFlangeType data={data?.data || []} isFetching={isFetching} value={flange?.id} onChange={changeHandler} />
	)
}

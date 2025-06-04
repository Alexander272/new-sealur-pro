import { useCallback } from 'react'

import type { IJacketedStandard } from '../../types/main'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { Standards as BaseStandards } from '@/features/gaskets/components/main/Standard/Standards'
import { useGetJacketedStandardQuery } from '../../jacketedApiSlice'
import { getStandard, setMainStandard } from '../../jacketedSlice'

export const Standards = () => {
	const standard = useAppSelector(getStandard)
	const dispatch = useAppDispatch()

	const { data, isFetching } = useGetJacketedStandardQuery(null)

	const changeHandler = useCallback((value: IJacketedStandard) => dispatch(setMainStandard(value)), [dispatch])

	return (
		<BaseStandards data={data?.data || []} isFetching={isFetching} value={standard?.id} onChange={changeHandler} />
	)
}

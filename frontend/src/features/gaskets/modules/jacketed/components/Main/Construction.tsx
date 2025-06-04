import { useCallback } from 'react'

import type { IConstruction } from '../../types/main'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { BaseConstruction } from '@/features/gaskets/components/main/Construction/Construction'
import { useGetJacketedConstructionsQuery } from '../../jacketedApiSlice'
import { getConstruction, setConstruction } from '../../jacketedSlice'

export const Construction = () => {
	const construction = useAppSelector(getConstruction)
	const dispatch = useAppDispatch()

	const { data, isFetching } = useGetJacketedConstructionsQuery(null)

	const changeHandler = useCallback((value: IConstruction) => dispatch(setConstruction(value)), [dispatch])

	return (
		<BaseConstruction
			data={data?.data || []}
			isFetching={isFetching}
			value={construction}
			onChange={changeHandler}
			hidden
		/>
	)
}

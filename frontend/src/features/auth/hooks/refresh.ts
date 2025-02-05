import { useEffect, useState } from 'react'

import { useAppDispatch } from '@/hooks/redux'
import { setAuth } from '@/features/user/userSlice'
import { useRefreshQuery } from '../authApiSlice'

export function useRefresh() {
	const [ready, setReady] = useState(false)

	const { data, isError, isSuccess } = useRefreshQuery(null)

	const dispatch = useAppDispatch()

	useEffect(() => {
		if (isSuccess) {
			dispatch(setAuth(data.data))
			setReady(true)
		}
	}, [isSuccess, data, dispatch])

	useEffect(() => {
		if (isError) setReady(true)
	}, [isError])

	return { ready }
}

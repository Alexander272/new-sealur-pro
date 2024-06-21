import { useEffect, useState } from 'react'
import { useAppDispatch } from './useStore'
import { setAuth } from '@/store/user'
import { useRefreshQuery } from '@/store/api/auth'

export function useRefresh() {
	const [ready, setReady] = useState(false)

	const dispatch = useAppDispatch()

	const { data, isError, isSuccess } = useRefreshQuery(null)

	useEffect(() => {
		if (isSuccess) {
			dispatch(setAuth(data.data))
			setReady(true)
		}
	}, [data, isSuccess, dispatch])

	useEffect(() => {
		if (isError) setReady(true)
	}, [isError])

	return { ready }
}

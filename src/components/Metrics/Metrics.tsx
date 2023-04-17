import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { sendMetric } from '@/services/metrics'

export default function Metrics() {
	const location = useLocation()

	useEffect(() => {
		sendMetric('hit', window.location.origin + location.pathname)
		// ;(window as any).ym(93215130, 'hit', window.location.origin + location.pathname)
	}, [location])

	return null
}

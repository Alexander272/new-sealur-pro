import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { FormControl, TextField } from '@mui/material'
import { toast } from 'react-toastify'

import { useDebounce } from '@/hooks/debounce'
import { useSaveInfoMutation } from '@/features/orders/ordersApiSlice'

type Props = {
	order: string
	data: string
}

export const Info: FC<Props> = ({ order, data }) => {
	const infoChanged = useRef(false)
	const [info, setInfo] = useState(data)
	const newInfo = useDebounce(info, 2000) //2 секунды

	const [save] = useSaveInfoMutation()

	const saveInfo = useCallback(async () => {
		try {
			await save({ orderId: order, info: newInfo }).unwrap()
		} catch {
			toast.error('Не удалось сохранить дополнительную информацию')
		}
	}, [newInfo, order, save])

	useEffect(() => {
		if (infoChanged.current) saveInfo()
	}, [newInfo, saveInfo])
	useEffect(() => {
		if (data == '') setInfo('')
	}, [data])

	const infoHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		infoChanged.current = true
		setInfo(event.target.value)
	}

	return (
		<FormControl sx={{ marginTop: 'auto', marginBottom: '10px' }}>
			<TextField value={info} onChange={infoHandler} label='Дополнительная информация' multiline rows={4} />
		</FormControl>
	)
}

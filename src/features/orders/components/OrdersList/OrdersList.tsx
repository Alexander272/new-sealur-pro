import { ChangeEvent, useState } from 'react'
import { Stack, TextField } from '@mui/material'

// import { useDebounce } from '@/hooks/debounce'
import { Fallback } from '@/components/Fallback/Fallback'

export const OrdersList = () => {
	const [number, setNumber] = useState('')
	// const search = useDebounce(number, 500)

	const isLoading = false

	const searchHandler = (event: ChangeEvent<HTMLInputElement>) => {
		setNumber(event.target.value)
	}

	return (
		<Stack>
			<TextField
				value={number}
				onChange={searchHandler}
				size='small'
				fullWidth
				sx={{ maxWidth: '700px' }}
				placeholder='№ заявки'
			/>

			{isLoading ? <Fallback background='#d8e0fc40' /> : null}
		</Stack>
	)
}

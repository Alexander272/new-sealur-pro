import { ChangeEvent, FC, useEffect, useState } from 'react'
import { Stack, Typography } from '@mui/material'
import { useDebounce } from '@/hooks/debounce'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { setSize, setThickness } from '@/store/rings/ring'
import { Input } from '@/components/Input/input.style'

type Props = {
	hasThickness?: boolean
}

export const CustomSize: FC<Props> = ({ hasThickness }) => {
	const size = useAppSelector(state => state.ring.sizes)
	const thickness = useAppSelector(state => state.ring.thickness)

	const [d3, setD3] = useState(size?.split('×')[0] != '00' ? size?.split('×')[0] || '' : '')
	const [d2, setD2] = useState(size?.split('×')[1] != '00' ? size?.split('×')[1] || '' : '')
	const [h, setH] = useState(thickness || '')

	const D3 = useDebounce(d3, 1000)
	const D2 = useDebounce(d2, 1000)
	const thick = useDebounce(h, 1000)

	const dispatch = useAppDispatch()

	useEffect(() => {
		dispatch(setSize(`${D3 || '00'}×${D2 || '00'}`))
	}, [D3, D2])
	useEffect(() => {
		dispatch(setThickness(thick || '0'))
	}, [thick])

	const sizeHandler = (type: 'd3' | 'd2' | 'h') => (event: ChangeEvent<HTMLInputElement>) => {
		const temp = event.target.value

		if (temp === '' || !isNaN(+temp)) {
			if (temp[temp.length - 1] == '.') return

			if (type == 'd3') setD3(temp)
			if (type == 'd2') setD2(temp)
			if (type == 'h') setH(temp)
		}
	}

	return (
		<Stack direction={'row'} spacing={1} margin={1} maxWidth={'550px'} width={'100%'} alignItems={'center'}>
			<Input
				value={d3}
				onChange={sizeHandler('d3')}
				name='ring_d3'
				label='Нар. диаметр, мм'
				size='small'
				autoFocus
			/>
			<Typography>×</Typography>
			<Input value={d2} onChange={sizeHandler('d2')} name='ring_d2' label='Вн. диаметр, мм' size='small' />

			{hasThickness && (
				<>
					<Typography>×</Typography>
					<Input value={h} onChange={sizeHandler('h')} name='ring_h' label='Высота, мм' size='small' />
				</>
			)}
		</Stack>
	)
}

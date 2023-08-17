import { ChangeEvent, FC, useEffect, useState } from 'react'
import { Autocomplete, Box, Stack, Typography, autocompleteClasses } from '@mui/material'
import SearchIcon from '@mui/icons-material/SearchOutlined'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { setSize, setThickness } from '@/store/rings/ring'
import type { IRingSize } from '@/types/rings'
import { Input } from '@/components/Input/input.style'

type Props = {
	sizes: IRingSize[]
	hasThickness?: boolean
}

export const ListSize: FC<Props> = ({ sizes, hasThickness }) => {
	const size = useAppSelector(state => state.ring.sizes)
	const thickness = useAppSelector(state => state.ring.thickness)

	const [curSize, setCurSize] = useState<IRingSize | null>(null)
	const [h, setH] = useState(thickness || '')

	const dispatch = useAppDispatch()

	useEffect(() => {
		const s = sizes.find(s => `${s?.outer}×${s?.inner}` == size)
		if (!s) return
		setCurSize(s)
	}, [])

	const selectSizeHandler = (_event: React.SyntheticEvent<Element, Event>, value: IRingSize | null) => {
		setCurSize(value)
		setH(value?.thickness.toString() || '0')

		dispatch(setSize(`${value?.outer}×${value?.inner}`))
		dispatch(setThickness(value?.thickness.toString() || '0'))
	}

	const sizeHandler = (event: ChangeEvent<HTMLInputElement>) => {
		const temp = event.target.value

		if (temp === '' || !isNaN(+temp)) {
			if (temp[temp.length - 1] == '.') return

			setH(temp)
		}
	}

	return (
		<Stack direction={'row'} spacing={1} margin={1} maxWidth={'550px'} alignItems={'center'}>
			<Box flexGrow={1} width={'100%'} maxWidth={'350px'}>
				<Autocomplete
					value={curSize}
					getOptionLabel={option => (typeof option === 'string' ? option : `${option.outer}×${option.inner}`)}
					// autoComplete
					// includeInputInList
					autoSelect
					options={sizes}
					// open={true}
					disablePortal
					popupIcon={<SearchIcon />}
					// popupIcon={null}
					onChange={selectSizeHandler}
					noOptionsText='Ничего не найдено'
					// onInputChange={companyHandler}
					fullWidth
					sx={{
						minWidth: '250px',
						[`& .${autocompleteClasses.popupIndicator}`]: {
							transform: 'none',
						},
					}}
					// filterOptions={(options, state) => {
					// 	return options.filter(
					// 		o =>
					// 			o.outer.toString().includes(state.inputValue) ||
					// 			o.inner.toString().includes(state.inputValue)
					// 	)
					// }}
					renderInput={params => (
						<Input {...params} name='ring_size' label='Габариты кольца' size='small' autoComplete='off' />
					)}
					// renderOption={(props, option) => {
					// 	return (
					// 		<li {...props} key={option.data.hid}>
					// 				<Typography>{option.value}</Typography>
					// 		</li>
					// 	)
					// }}
				/>
			</Box>

			{hasThickness && (
				<>
					<Typography>×</Typography>
					<Input value={h} onChange={sizeHandler} name='ring_h' label='Высота, мм' size='small' />
				</>
			)}
		</Stack>
	)
}

import { Typography } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { RadioGroup, RadioItem } from '@/components/RadioGroup/RadioGroup'
import { getUseDimensions, setUseDimensions } from '../../../putgSlice'

export const Dimensions = () => {
	const useDimensions = useAppSelector(getUseDimensions)
	const dispatch = useAppDispatch()

	const changeUseDimensions = (value: string) => {
		dispatch(setUseDimensions(value === 'dimensions'))
	}

	return (
		<>
			<Typography fontWeight='bold'>Размеры через</Typography>
			<RadioGroup onChange={changeUseDimensions}>
				<RadioItem value='dimensions' active={useDimensions}>
					Габариты
				</RadioItem>
				<RadioItem value='field' active={!useDimensions}>
					Поле
				</RadioItem>
			</RadioGroup>
		</>
	)
}

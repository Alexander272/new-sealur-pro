import { Typography } from '@mui/material'
import { FC } from 'react'
import { AsideContainer } from '@/pages/Gasket/gasket.style'

type Props = {}

export const Materials: FC<Props> = () => {
	//TODO дописать
	return (
		<AsideContainer>
			{/*  */}
			<Typography fontWeight='bold'>Материал прокладки</Typography>

			<Typography fontWeight='bold'>Тип прокладки</Typography>

			<Typography fontWeight='bold'>Тип конструкции</Typography>

			<Typography fontWeight='bold'>Материал обтюраторов</Typography>
			<Typography fontWeight='bold'>Материал внутреннего ограничителя</Typography>
			<Typography fontWeight='bold'>Материал внешнего ограничителя</Typography>
		</AsideContainer>
	)
}

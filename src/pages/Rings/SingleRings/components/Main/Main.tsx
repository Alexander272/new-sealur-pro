import { Column, MainContainer } from '@/pages/Gasket/gasket.style'
import { IRingsType } from '@/types/rings'
import { MenuItem, Select, Typography } from '@mui/material'
import { useState } from 'react'

const ringsType = [
	{
		id: '1',
		title: 'Витое',
		code: 'В',
		hasRotaryPlug: true,
		hasDensity: true,
	},
	{
		id: '2',
		title: 'Витое армированное',
		code: 'ВА',
		hasRotaryPlug: false,
		hasDensity: false,
	},
	{
		id: '3',
		title: 'Плетеное',
		code: 'П',
		hasRotaryPlug: false,
		hasDensity: false,
	},
	{
		id: '4',
		title: 'Слоеное (сэндвич)',
		code: 'С',
		hasRotaryPlug: false,
		hasDensity: false,
	},
	{
		id: '5',
		title: 'Композиционное',
		code: 'К',
		hasRotaryPlug: false,
		hasDensity: true,
	},
]

const density = [
	{ id: '1', code: 'Н', title: 'до 1,3 включ.' },
	{ id: '2', code: 'А', title: 'св. 1,3 до 1,5 включ.' },
	{ id: '3', code: 'Б', title: 'св. 1,5 до 1,7 включ.' },
	{ id: '4', code: 'В', title: 'св. 1,7' },
]

export const Main = () => {
	const [ringType, setRingType] = useState<IRingsType | null>(ringsType[0])

	return (
		<MainContainer>
			<Column>
				<Typography fontWeight='bold'>Тип исполнения кольца</Typography>
				<Select value={ringType?.code || 'not_selected'} size='small' sx={{ borderRadius: '12px' }}>
					<MenuItem disabled value='not_selected'>
						Выберите тип кольца
					</MenuItem>
					{ringsType.map(r => (
						<MenuItem key={r.id} value={r.code}>
							{r.title}
						</MenuItem>
					))}
				</Select>

				{ringType?.hasDensity && (
					<>
						<Typography fontWeight='bold' mt={1}>
							Плотность, г/см<sup>3</sup>
						</Typography>

						<Select value={'not_selected'} size='small' sx={{ borderRadius: '12px' }}>
							<MenuItem disabled value='not_selected'>
								Выберите плотность
							</MenuItem>
							{density.map(d => (
								<MenuItem key={d.id} value={d.code}>
									{d.title}
								</MenuItem>
							))}
						</Select>
					</>
				)}

				{ringType?.hasRotaryPlug && (
					<>
						<Typography fontWeight='bold' mt={1}>
							Тип конструкции
						</Typography>

						<Select value={'not_selected'} size='small' sx={{ borderRadius: '12px' }}>
							<MenuItem disabled value='not_selected'>
								Выберите конструкцию
							</MenuItem>
						</Select>
					</>
				)}
			</Column>
			<Column>
				<Typography fontWeight='bold'>Чертеж?</Typography>
			</Column>
		</MainContainer>
	)
}

import { FC } from 'react'
import { FormControl, MenuItem, Select, Typography } from '@mui/material'
import { MainContainer, Column } from '@/pages/Gasket/gasket.style'
import { useAppSelector } from '@/hooks/useStore'
import FlangeA from '@/assets/snp/A.webp'
import FlangeB from '@/assets/snp/B.webp'
import FlangeV from '@/assets/snp/V.webp'

type Props = {}

export const Main: FC<Props> = () => {
	const standards = useAppSelector(state => state.snp.standardForSNP)
	const flangeTypes = useAppSelector(state => state.snp.flangeType)

	const snp = useAppSelector(state => state.snp.snp)

	//! стоит ли делать это функцией
	const chooseFlangeImage = () => {
		switch (snp?.typeFlangeCode) {
			case 'А':
				return FlangeA
			case 'Б':
				return FlangeB
			case 'В':
				return FlangeV
		}
	}

	return (
		<MainContainer>
			<Column>
				<Typography>Стандарт на прокладку / стандарт на фланец</Typography>
				<FormControl size='small'>
					<Select sx={{ borderColor: 'var(--border-color)', borderWidth: '2px', borderRadius: '12px' }}>
						{standards.map(s => (
							<MenuItem key={s.id} value={s.id}>
								{s.standard} / {s.flangeStandard}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<Typography>Тип фланца</Typography>
				<Select size='small'>
					{flangeTypes.map(f => (
						<MenuItem key={f.id} value={f.code}>
							{f.title}
						</MenuItem>
					))}
				</Select>
			</Column>
			<Column>
				<Typography>Чертеж фланца</Typography>
				{/* <Image src={chooseFlangeImage()} alt='flange drawing' /> */}
			</Column>
		</MainContainer>
	)
}

import { FC } from 'react'
import { Typography } from '@mui/material'
import { useAppSelector } from '@/hooks/useStore'
import { Column, ImageContainer, SizeContainer, Image } from '@/pages/Gasket/gasket.style'
import { StandardSize } from './StandardSize'
import { AnotherSize } from './AnotherSize'
import SnpD from '@/assets/snp/SNP-P-E.webp'
import SnpG from '@/assets/snp/SNP-P-D.webp'
import SnpV from '@/assets/snp/SNP-P-C.webp'
import SnpB from '@/assets/snp/SNP-P-AB.webp'
import SnpA from '@/assets/snp/SNP-P-AB.webp'
import { useGetSnpQuery } from '@/store/api'

const images = {
	Д: SnpD,
	Г: SnpG,
	В: SnpV,
	Б: SnpB,
	А: SnpA,
}

type Props = {}

export const Size: FC<Props> = () => {
	const main = useAppSelector(state => state.snp.main)

	const { data } = useGetSnpQuery(
		{ typeId: main.snpTypeId, hasD2: main.snpStandard?.hasD2 },
		{ skip: main.snpTypeId == 'not_selected' }
	)

	return (
		<SizeContainer>
			<Column width={45}>
				{main.snpStandard?.flangeStandard.code && data?.data.sizes ? (
					<StandardSize sizes={data.data.sizes} />
				) : (
					<AnotherSize />
				)}
			</Column>
			<Column width={55}>
				<Typography fontWeight='bold'>Чертеж прокладки</Typography>
				<ImageContainer>
					<Image src={images[main.snpTypeTitle as 'Д']} alt='gasket drawing' />
				</ImageContainer>
			</Column>
		</SizeContainer>
	)
}

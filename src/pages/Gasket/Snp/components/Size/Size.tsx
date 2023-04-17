import { FC } from 'react'
import { Typography } from '@mui/material'
import { useAppSelector } from '@/hooks/useStore'
import { useGetSnpQuery } from '@/store/api/snp'
import { Column, ImageContainer, SizeContainer, Image, PlugImage } from '@/pages/Gasket/gasket.style'
import { BacklightSnp } from './components/Backlight/BacklightSnp'
import { SizesBlockSnp } from './components/SizesBlock/SizesBlock'
import { StandardSize } from './StandardSize'
import { AnotherSize } from './AnotherSize'

import SnpD from '@/assets/snp/SNP-P-E.webp'
import SnpG from '@/assets/snp/SNP-P-D.webp'
import SnpV from '@/assets/snp/SNP-P-C.webp'
import SnpB from '@/assets/snp/SNP-P-AB.webp'
import SnpA from '@/assets/snp/SNP-P-AB.webp'
import { Loader } from '@/components/Loader/Loader'

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
	// const sizes = useAppSelector(state => state.snp.size)

	const { data, isError, isLoading } = useGetSnpQuery(
		{ typeId: main.snpTypeId, hasD2: main.snpStandard?.hasD2 },
		{ skip: main.snpTypeId == 'not_selected' }
	)

	return (
		<SizeContainer>
			{isError ? (
				<Column width={45}>
					<Typography variant='h6' color={'error'} align='center'>
						Не удалось загрузить размеры
					</Typography>
				</Column>
			) : (
				<Column width={45}>
					{!data || isLoading ? (
						<Loader background='fill' />
					) : main.snpStandard?.flangeStandard.code && data?.data.sizes ? (
						<StandardSize sizes={data.data.sizes} />
					) : (
						<AnotherSize />
					)}
				</Column>
			)}
			<Column width={55}>
				<Typography fontWeight='bold'>Чертеж прокладки</Typography>
				{!main.snpType ? (
					<PlugImage />
				) : (
					<ImageContainer>
						<Image
							src={images[main.snpType.title as 'Д']}
							alt='gasket drawing'
							maxWidth={'500px'}
							width={600}
							height={255}
						/>

						<SizesBlockSnp />
						<BacklightSnp />
					</ImageContainer>
				)}
			</Column>
		</SizeContainer>
	)
}

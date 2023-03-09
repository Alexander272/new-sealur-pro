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
import { SizesBlock } from '@/components/SizesBlock/SizesBlock'
import { Backlight } from '@/components/Backlight/Backlight'

const images = {
	Д: SnpD,
	Г: SnpG,
	В: SnpV,
	Б: SnpB,
	А: SnpA,
}

const positions = {
	Д: {
		frame: { top: '2%', left: '79%' },
		ring: { top: '2%', left: '7%' },
		twisted: { top: '2%', left: '19%' },
		d4: { top: '78%' },
		d3: { top: '65%' },
		d2: { top: '52%' },
		d1: { top: '39%' },
	},
	Г: {
		frame: { top: '2%', left: '79%' },
		ring: { top: '2%', left: '7%' },
		twisted: { top: '2%', left: '19%' },
		d4: { top: '78%' },
		d3: { top: '65%' },
		d2: { top: '52%' },
	},
	В: {
		ring: { top: '2%', left: '79%' },
		twisted: { top: '2%', left: '9%' },
		frame: { top: '2%', left: '22%' },
		d3: { top: '77%' },
		d2: { top: '61%' },
		d1: { top: '46%' },
	},
	Б: {
		frame: { top: '2%', left: '83%' },
		twisted: { top: '2%', left: '14%' },
		d3: { top: '77%' },
		d2: { top: '61%' },
	},
	А: {
		frame: { top: '2%', left: '83%' },
		twisted: { top: '2%', left: '14%' },
		d3: { top: '77%' },
		d2: { top: '61%' },
	},
}

type Props = {}

export const Size: FC<Props> = () => {
	const main = useAppSelector(state => state.snp.main)
	const sizes = useAppSelector(state => state.snp.size)

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
					<SizesBlock
						sizes={sizes}
						hasD2={main.snpStandard?.hasD2}
						positions={positions[main.snpTypeTitle as 'Д']}
					/>
					{/* //TODO блок зависит от того какой материал открыт и от того какой тип прокладки выбран */}
					{/* <Backlight /> */}
				</ImageContainer>
			</Column>
		</SizeContainer>
	)
}

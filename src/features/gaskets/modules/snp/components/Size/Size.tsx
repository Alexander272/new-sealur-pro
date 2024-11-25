import { FC, useEffect } from 'react'
import { Skeleton, Typography } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { useGetSnpQuery } from '@/store/api/snp'
import { setIsReady } from '@/store/gaskets/snp'
import { Column, ImageContainer, SizeContainer, Image } from '@/pages/Gasket/gasket.style'
import { SizeSkeleton } from '@/pages/Gasket/Skeletons/SizeSkeleton'
import { BacklightSnp } from './components/Backlight/BacklightSnp'
import { SizesBlockSnp } from './components/SizesBlock/SizesBlock'
import { StandardSize } from './StandardSize'
import { AnotherSize } from './AnotherSize'

import SnpD from '@/assets/snp/SNP-P-E.webp'
import SnpG from '@/assets/snp/SNP-P-D.webp'
import SnpV from '@/assets/snp/SNP-P-C.webp'
import SnpB from '@/assets/snp/SNP-P-AB.webp'
import SnpA from '@/assets/snp/SNP-P-AB.webp'

const images = {
	Д: SnpD,
	Г: SnpG,
	В: SnpV,
	Б: SnpB,
	А: SnpA,
}

type Props = unknown

export const Size: FC<Props> = () => {
	const isReady = useAppSelector(state => state.snp.isReady)

	const main = useAppSelector(state => state.snp.main)
	// const sizes = useAppSelector(state => state.snp.size)

	const dispatch = useAppDispatch()

	const { data, isError, isLoading, isSuccess, isUninitialized, isFetching } = useGetSnpQuery(
		{ typeId: main.snpTypeId, hasD2: main.snpStandard?.hasD2 },
		{ skip: main.snpTypeId == 'not_selected' }
	)

	useEffect(() => {
		if (!isUninitialized) dispatch(setIsReady(!isLoading))
	}, [isSuccess, isError, isUninitialized, dispatch, isLoading])

	if (!isReady) {
		return (
			<SizeContainer>
				<SizeSkeleton />
				<Column width={55}>
					<Skeleton animation='wave' />
					<Skeleton animation='wave' variant='rounded' width={'100%'} height={222} />
				</Column>
			</SizeContainer>
		)
	}

	return (
		<SizeContainer>
			{isError && (
				<Column width={45}>
					<Typography variant='h6' color={'error'} align='center'>
						Не удалось загрузить размеры
					</Typography>
				</Column>
			)}

			{!isError && !isLoading ? (
				<Column width={45}>
					{main.snpStandard?.flangeStandard.code && data?.data.sizes ? (
						<StandardSize sizes={data.data.sizes} isFetching={isFetching} />
					) : (
						<AnotherSize />
					)}
				</Column>
			) : null}

			<Column width={55}>
				<Typography fontWeight='bold'>Чертеж прокладки</Typography>
				{!main.snpType ? (
					<Skeleton animation='wave' variant='rounded' width={'100%'} height={245} />
				) : (
					<ImageContainer>
						<Image
							src={images[main.snpType.title as 'Д']}
							alt='gasket drawing'
							maxWidth={'550px'}
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

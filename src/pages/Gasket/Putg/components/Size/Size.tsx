import { FC, useEffect, useState } from 'react'
import { Skeleton, Typography } from '@mui/material'
import { useGetPutgSizeQuery } from '@/store/api/putg'
import { setIsReady } from '@/store/gaskets/putg'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { SizeSkeleton } from '@/pages/Gasket/Skeletons/SizeSkeleton'
import { Column, Image, ImageContainer, SizeContainer } from '@/pages/Gasket/gasket.style'
import { PutgImage } from './components/PutgImage/PutgImage'
import { PutgPartImage } from './components/PutgImage/PutgPartImage'
import { SizesBlockPutg } from './components/SizesBlock/SizesBlock'
import { PartSizeBlock } from './components/SizesBlock/PartSizeBlock'
import { StandardSize } from './StandardSize'
import { AnotherSize } from './AnotherSize'
import ConfigurationSize from './ConfigurationSize'

import ovalImage from '@/assets/putg/ov.webp'
import rectangularImage from '@/assets/putg/pr.webp'
import { IPutgSize } from '@/types/sizes'

const images = {
	oval: ovalImage,
	rectangular: rectangularImage,
}

type Props = {}

export const Size: FC<Props> = () => {
	const [sizes, setSizes] = useState<IPutgSize[]>([])

	const material = useAppSelector(state => state.putg.material)
	const main = useAppSelector(state => state.putg.main)

	const isReady = useAppSelector(state => state.putg.isReady)

	const dispatch = useAppDispatch()

	const { data, isError, isLoading, isFetching, isSuccess, isUninitialized } = useGetPutgSizeQuery(
		{
			flangeTypeId: main.flangeType?.id || '',
			baseConstructionId: material.construction?.baseId || '',
			baseFillerId: material.filler?.baseId || '',
		},
		{
			skip:
				!main.flangeType?.id ||
				!material.construction ||
				!material.filler ||
				main.configuration?.code != 'round',
		}
	)

	useEffect(() => {
		if (data) {
			// const equal = data.data?.sizes?.every((element, index) => {
			// 	const x1 = { ...element }
			// 	const x2 = { ...sizes[index] }
			// 	x1.id = ''
			// 	x2.id = ''

			// 	return JSON.stringify(x1) == JSON.stringify(x2)
			// })

			// if (!sizes.length || sizes.length !== data.data?.sizes?.length || !equal) {
			// 	setSizes(data.data?.sizes || [])
			// }

			setSizes(data.data?.sizes || [])
		}
	}, [data])

	useEffect(() => {
		if (!isUninitialized) dispatch(setIsReady(true))
	}, [isSuccess, isError, isUninitialized])

	if (!isReady)
		return (
			<SizeContainer>
				<SizeSkeleton />
				<Column width={55}>
					<Skeleton animation='wave' />
					<Skeleton animation='wave' variant='rounded' width={'100%'} height={222} />
				</Column>
			</SizeContainer>
		)

	return (
		<SizeContainer>
			{isError && (
				<Column width={40}>
					<Typography variant='h6' color={'error'} align='center'>
						Не удалось загрузить размеры
					</Typography>
				</Column>
			)}

			{!isError && !isLoading ? (
				<Column width={40}>
					{data?.data.sizes && sizes.length ? (
						<StandardSize sizes={sizes} isFetching={isFetching} />
					) : (
						<>
							{main.configuration?.code !== 'round' && <ConfigurationSize />}
							{main.configuration?.code === 'round' && <AnotherSize />}
						</>
					)}
				</Column>
			) : null}

			<Column width={60}>
				<Typography fontWeight='bold'>Чертеж прокладки</Typography>
				{/* <PlugImage /> */}
				{main.configuration?.code == 'round' && (
					<ImageContainer>
						<PutgImage type={material.putgType} construction={material.construction} />
						<SizesBlockPutg />
					</ImageContainer>
				)}

				{main.configuration?.code != 'round' && (
					<>
						<ImageContainer padding='0'>
							<PutgPartImage type={material.putgType} construction={material.construction} />
						</ImageContainer>

						<Typography fontWeight='bold'>Размеры прокладки</Typography>
						<ImageContainer padding='0 20px'>
							<Image
								src={images[main.configuration?.code || 'rectangular']}
								alt='gasket drawing'
								maxWidth={'400px'}
								width={600}
								height={255}
							/>
							<PartSizeBlock />
						</ImageContainer>
					</>
				)}
			</Column>
		</SizeContainer>
	)
}

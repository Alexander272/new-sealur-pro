import { FC } from 'react'
import { Typography } from '@mui/material'
import { useGetPutgDataQuery } from '@/store/api/putg'
import { useAppSelector } from '@/hooks/useStore'
import { Loader } from '@/components/Loader/Loader'
import { Column, ImageContainer, SizeContainer } from '@/pages/Gasket/gasket.style'
import { PutgImage } from './components/PutgImage/PutgImage'
import { SizesBlockPutg } from './components/SizesBlock/SizesBlock'
import { StandardSize } from './StandardSize'
import { AnotherSize } from './AnotherSize'

type Props = {}

export const Size: FC<Props> = () => {
	const material = useAppSelector(state => state.putg.material)
	const main = useAppSelector(state => state.putg.main)

	const { data, isError, isLoading } = useGetPutgDataQuery(
		{
			standardId: main.standard?.id || '',
			constructionId: material.construction?.id || '',
			baseConstructionId: material.construction?.baseId || '',
			configuration: main.configuration?.code || '',
		},
		{ skip: !main.standard?.id || !material.construction }
	)

	return (
		<SizeContainer rowStart={5} rowEnd={9}>
			{isError ? (
				<Column width={40}>
					<Typography variant='h6' color={'error'} align='center'>
						Не удалось загрузить размеры
					</Typography>
				</Column>
			) : (
				// TODO придумать как лучше показывать loader
				<Column width={40}>
					{!data || isLoading ? (
						<Loader background='fill' />
					) : data?.data.sizes ? (
						<StandardSize sizes={data.data.sizes} />
					) : (
						<AnotherSize />
					)}
				</Column>
			)}
			<Column width={60}>
				<Typography fontWeight='bold'>Чертеж прокладки</Typography>
				{/* <PlugImage /> */}
				<ImageContainer>
					<PutgImage type={material.type} construction={material.construction} />
					<SizesBlockPutg />
				</ImageContainer>

				{/* //TODO понять как определять какую картинку вывести */}
				{/* {!main.snpType ? (
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

						<SizesBlockPutg />

					</ImageContainer>
				)} */}
			</Column>
		</SizeContainer>
	)
}

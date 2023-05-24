import { FC } from 'react'
import { Typography } from '@mui/material'
import { useGetPutgDataQuery, useGetPutgSizeQuery } from '@/store/api/putg'
import { useAppSelector } from '@/hooks/useStore'
import { Loader } from '@/components/Loader/Loader'
import { Column, ImageContainer, SizeContainer } from '@/pages/Gasket/gasket.style'
import { PutgImage } from './components/PutgImage/PutgImage'
import { SizesBlockPutg } from './components/SizesBlock/SizesBlock'
import { StandardSize } from './StandardSize'
import { AnotherSize } from './AnotherSize'
import ConfigurationSize from './ConfigurationSize'

type Props = {}

export const Size: FC<Props> = () => {
	const material = useAppSelector(state => state.putg.material)
	const main = useAppSelector(state => state.putg.main)

	// const { data, isError, isLoading } = useGetPutgDataQuery(
	// 	{
	// 		standardId: main.standard?.id || '',
	// 		constructionId: material.construction?.id || '',
	// 		baseConstructionId: material.construction?.baseId || '',
	// 		configuration: main.configuration?.code || '',
	// 	},
	// 	{ skip: !main.standard?.id || !material.construction }
	// )

	const { data, isError, isLoading } = useGetPutgSizeQuery(
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

	console.log(isLoading)
	console.log(data)

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
					{isLoading ? (
						<Loader background='fill' />
					) : data?.data.sizes ? (
						<StandardSize sizes={data.data.sizes} />
					) : (
						<>
							{main.configuration?.code !== 'round' && <ConfigurationSize />}
							{main.configuration?.code === 'round' && <AnotherSize />}
						</>
					)}
				</Column>
			)}
			<Column width={60}>
				<Typography fontWeight='bold'>Чертеж прокладки</Typography>
				{/* <PlugImage /> */}
				{main.configuration?.code == 'round' && (
					<ImageContainer>
						<PutgImage type={material.type} construction={material.construction} />
						<SizesBlockPutg />
					</ImageContainer>
				)}

				{main.configuration?.code != 'round' && <></>}

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

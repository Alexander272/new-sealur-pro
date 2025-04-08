import { Typography } from '@mui/material'

import { Column } from '@/features/gaskets/components/Skeletons/gasket.style'

export const Drawing = () => {
	return (
		<Column width={60}>
			<Typography fontWeight='bold'>Чертеж прокладки</Typography>
			{/*{!configuration || !construction || !type ? (
					<Skeleton animation='wave' variant='rounded' width={'100%'} height={222} />
				) : (
					<>
						{configuration?.code == 'round' && (
							<ImageContainer>
								<StandardImage type={type} construction={construction} />
								<SizesBlock />
							</ImageContainer>
						)}

						{configuration?.code != 'round' && (
							<>
								<ImageContainer padding='0'>
									<NotStandardImage type={type} construction={construction} />
								</ImageContainer>

								<Typography fontWeight='bold'>Размеры прокладки</Typography>
								<ImageContainer padding='0 20px'>
									<Image
										src={images[configuration?.code || 'rectangular']}
										alt='gasket drawing'
										maxWidth={'400px'}
										width={600}
										height={255}
									/>
									<AnotherSizeBlock />
								</ImageContainer>
							</>
						)}
					</>
				)}*/}
		</Column>
	)
}

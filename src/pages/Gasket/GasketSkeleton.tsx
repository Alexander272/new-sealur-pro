import { Skeleton } from '@mui/material'
import { AsideContainer, Column, Content, MainContainer, PageTitle, SizeContainer } from './gasket.style'
import { MainSkeleton } from './Skeletons/MainSkeleton'
import { MaterialSkeleton } from './Skeletons/MaterialSkeleton'
import { SizeSkeleton } from './Skeletons/SizeSkeleton'
import { DesignSkeleton } from './Skeletons/DesignSkeleton'
import { ResultSkeleton } from './Skeletons/ResultSkeleton'

export const GasketSkeleton = () => {
	return (
		<>
			<PageTitle>
				<Skeleton animation='wave' sx={{ width: '50%', margin: 'auto' }} />
			</PageTitle>

			<Content>
				<MainContainer>
					<MainSkeleton />
					<Column>
						<Skeleton animation='wave' />
						<Skeleton animation='wave' variant='rounded' width={'100%'} height={222} />
					</Column>
				</MainContainer>

				<AsideContainer>
					<MaterialSkeleton />
				</AsideContainer>

				<SizeContainer>
					<SizeSkeleton />
					<Column width={55}>
						<Skeleton animation='wave' />
						<Skeleton animation='wave' variant='rounded' width={'100%'} height={222} />
					</Column>
				</SizeContainer>

				<AsideContainer>
					<DesignSkeleton />
				</AsideContainer>

				<ResultSkeleton />
			</Content>
		</>
	)
}

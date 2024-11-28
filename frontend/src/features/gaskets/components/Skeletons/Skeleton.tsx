import { Skeleton } from '@mui/material'

import { MainSkeleton } from '@/features/gaskets/components/Skeletons/MainSkeleton'
import { MaterialSkeleton } from '@/features/gaskets/components/Skeletons/MaterialSkeleton'
import { SizeSkeleton } from '@/features/gaskets/components/Skeletons/SizeSkeleton'
import { DesignSkeleton } from '@/features/gaskets/components/Skeletons/DesignSkeleton'
import { ResultSkeleton } from '@/features/gaskets/components/Skeletons/ResultSkeleton'
import { AsideContainer, Column, Content, MainContainer, PageTitle, SizeContainer } from './gasket.style'

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

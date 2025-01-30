import { Stack } from '@mui/material'

import { ResultContainer } from '@/features/gaskets/components/Skeletons/gasket.style'
import { Information } from './Information'
import { Amount } from './Amount'
import { Buttons } from './Buttons'
import { Description } from './Description'
import { Designation } from './Designation'

export const Result = () => {
	return (
		<ResultContainer>
			<Description />
			<Designation />
			<Information />

			<Stack
				direction={{ xs: 'column', md: 'row' }}
				spacing={2}
				alignItems={{ xs: 'flex-start', md: 'center' }}
				justifyContent='space-between'
			>
				<Amount />
				<Buttons />
			</Stack>
		</ResultContainer>
	)
}

import { Stack } from '@mui/material'
import { TypeRings } from './components/TypeRings/TypeRings'
import { Sizes } from './components/Sizes/Sizes'
import { Material } from './components/Material/Material'
import { Modifying } from './components/Modifying/Modifying'
import { PageTitle } from '@/pages/Gasket/gasket.style'

export default function SingleRings() {
	return (
		<>
			<PageTitle>Кольца уплотнительные</PageTitle>

			<Stack direction={'row'} mt={6} mb={4} alignItems={'center'} justifyContent={'center'} fontSize={'1.12rem'}>
				Кольцо
				<TypeRings />
				–<Sizes />
				–<Material />
				–<Modifying />
				ТУ 5728-001-93978201-2008
			</Stack>
		</>
	)
}

// import { Content, PageTitle } from '../rings.style'

import { Stack } from '@mui/material'
import { Main } from './components/Main/Main'
import { Size } from './components/Size/Size'
import { Materials } from './components/Materials/Materials'
import { TypeRings } from './components/TypeRings/TypeRings'
import { Sizes } from './components/Sizes/Sizes'
import { Material } from './components/Material/Material'
import { Modifying } from './components/Modifying/Modifying'
import { Content, PageTitle } from '@/pages/Gasket/gasket.style'

export default function SingleRings() {
	return (
		<>
			<PageTitle>Кольца уплотнительные</PageTitle>
			{/* <Content>
				<Main />
				<Size />
				<Materials />
			</Content> */}
			<Stack direction={'row'} mt={6} mb={4} alignItems={'center'} justifyContent={'center'}>
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
import { Stack, Typography } from '@mui/material'
import { TypeRings } from './components/TypeRings/TypeRings'
import { Sizes } from './components/Sizes/Sizes'
import { Material } from './components/Material/Material'
import { Modifying } from './components/Modifying/Modifying'
import { Drawing } from './components/Drawing/Drawing'
import { Design } from '../components/Design/Design'
import { Result } from './components/Result/Result'
import { PageTitle } from '@/pages/Gasket/gasket.style'

export default function SingleRings() {
	return (
		<>
			<PageTitle>Кольца уплотнительные</PageTitle>

			<Stack
				direction={'row'}
				mt={5}
				// mb={4}
				mb={2}
				alignItems={'center'}
				justifyContent={'center'}
				fontSize={'1.12rem'}
			>
				<Typography fontSize={'inherit'}>Кольцо</Typography>
				<TypeRings />
				–<Sizes />
				–<Material />
				–<Modifying />
				<Drawing />
				<Typography fontSize={'inherit'}>ТУ 5728-001-93978201-2008</Typography>
			</Stack>

			<Stack direction={'row'} spacing={2} width={'100%'} maxWidth={1200} ml={'auto'} mr={'auto'}>
				<Stack width={'65%'}>
					<Result />
				</Stack>

				<Stack width={'35%'}>
					<Design title='Если кольцо не прямоугольного сечения (например, конусное) или с отличающейся от предложенных плотностей, прикрепите чертеж.' />
				</Stack>
			</Stack>
		</>
	)
}

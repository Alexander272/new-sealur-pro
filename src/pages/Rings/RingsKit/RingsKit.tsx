import { Stack, Typography } from '@mui/material'
import { PageTitle } from '../rings.style'
// import { Design } from '../components/Design/Design'
import { KitType } from './components/Type/KitType'
import { Count } from './components/Count/Count'
import { Sizes } from './components/Sizes/Sizes'
import { Materials } from './components/Materials/Materials'
import { Modifying } from './components/Modifying/Modifying'
import { Drawing } from '../SingleRings/components/Drawing/Drawing'

export default function RingsKit() {
	return (
		<>
			<PageTitle>Комплекты колец</PageTitle>

			<Stack
				direction={'row'}
				mt={5}
				// mb={4}
				mb={2}
				alignItems={'center'}
				justifyContent={'center'}
				fontSize={'1.12rem'}
			>
				<Typography fontSize={'inherit'}>Комплект</Typography>
				<KitType />
				–<Count />
				–<Sizes />
				–<Materials />
				–<Modifying />
				<Drawing />
				<Typography fontSize={'inherit'}>ТУ 5728-001-93978201-2008</Typography>
			</Stack>

			<Stack direction={'row'} spacing={2} width={'100%'} maxWidth={1200} ml={'auto'} mr={'auto'}>
				<Stack width={'65%'}></Stack>

				<Stack width={'35%'}>{/* <Design /> */}</Stack>
			</Stack>
		</>
	)
}

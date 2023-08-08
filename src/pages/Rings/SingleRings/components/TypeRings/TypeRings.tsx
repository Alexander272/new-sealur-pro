import { IRingsType } from '@/types/rings'
import { Box, Divider, List, ListItemButton, ListSubheader, Menu, Stack } from '@mui/material'
import { MouseEvent, useRef, useState } from 'react'

const ringsType = [
	{
		id: '1',
		title: 'Витое',
		code: 'В',
		hasRotaryPlug: true,
		hasDensity: true,
	},
	{
		id: '2',
		title: 'Витое армированное',
		code: 'ВА',
		hasRotaryPlug: false,
		hasDensity: false,
	},
	{
		id: '3',
		title: 'Плетеное',
		code: 'П',
		hasRotaryPlug: false,
		hasDensity: false,
	},
	{
		id: '4',
		title: 'Слоеное (сэндвич)',
		code: 'С',
		hasRotaryPlug: false,
		hasDensity: false,
	},
	{
		id: '5',
		title: 'Композиционное',
		code: 'К',
		hasRotaryPlug: false,
		hasDensity: true,
	},
]

const densityData = [
	{ id: '1', code: 'Н', title: 'до 1,3 включ.' },
	{ id: '2', code: 'А', title: 'св. 1,3 до 1,5 включ.' },
	{ id: '3', code: 'Б', title: 'св. 1,5 до 1,7 включ.' },
	{ id: '4', code: 'В', title: 'св. 1,7' },
]

const rotaryPlugData = [
	{ id: '1', code: '00', title: 'Кольцо без обтюраторов' },
	{ id: '2', code: '01', title: 'Кольцо, оснащенное одним торцевым плоским обтюратором' },
	{ id: '3', code: '21', title: 'Кольцо, оснащенное двумя торцевыми плоскими обтюраторами' },
	{
		id: '4',
		code: '02',
		title: 'Кольцо, оснащенное торцевым П-образным (тарельчатым) обтюратором или двумя угловыми обтюраторами.',
	},
	{
		id: '5',
		code: '22',
		title: 'Кольцо, оснащенное двумя торцевыми П-образными обтюраторами или четырьмя угловыми обтюраторами.',
	},
]

export const TypeRings = () => {
	const anchor = useRef<HTMLDivElement | null>(null)
	const [open, setOpen] = useState(false)

	const [ringType, setRingType] = useState<IRingsType | null>(null)
	const [rotaryPlug, setRotaryPlug] = useState<string | null>(null)
	const [density, setDensity] = useState<string | null>(null)

	const openHandler = () => setOpen(true)
	const closeHandler = () => setOpen(false)

	const selectTypeRings = (event: MouseEvent<HTMLDivElement>) => {
		const { index } = (event.target as HTMLDivElement).dataset
		if (!index) return

		setRingType(ringsType[+index])
		if (!ringsType[+index].hasDensity && !ringsType[+index].hasRotaryPlug) closeHandler()
	}

	const selectRotaryPlug = (event: MouseEvent<HTMLDivElement>) => {
		const { index } = (event.target as HTMLDivElement).dataset
		if (!index) return

		setRotaryPlug(rotaryPlugData[+index].code)

		if ((ringType?.hasDensity && density) || !ringType?.hasDensity) closeHandler()
	}

	const selectDensity = (event: MouseEvent<HTMLDivElement>) => {
		const { index } = (event.target as HTMLDivElement).dataset
		if (!index) return

		setDensity(densityData[+index].code)

		if ((ringType?.hasRotaryPlug && rotaryPlug) || !ringType?.hasRotaryPlug) closeHandler()
	}

	return (
		<>
			<Box
				onClick={openHandler}
				ref={anchor}
				padding={'6px 8px'}
				ml={'4px'}
				mr={'4px'}
				// border={'1px solid var(--primary-color)'}
				borderRadius={'12px'}
				sx={{
					cursor: 'pointer',
					transition: 'all .3s ease-in-out',
					':hover': { backgroundColor: '#0000000a' },
				}}
			>
				{ringType?.hasRotaryPlug ? (rotaryPlug || '00') + '-' : ''}
				{ringType?.code || 'Х'}
				{ringType?.hasDensity ? '-' + (density || 'Х') : ''}
			</Box>
			<Menu
				id={'type-ring-menu'}
				open={open}
				onClose={closeHandler}
				// onClick={selectHandler}
				anchorEl={anchor.current}
				transformOrigin={{ horizontal: 'center', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
				MenuListProps={{
					role: 'listbox',
					disableListWrap: true,
					// style: { maxHeight: '70vh' },
				}}
				slotProps={{
					paper: {
						elevation: 0,
						sx: {
							overflow: 'visible',
							filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
							// mt: 1.5,
							'&:before': {
								content: '""',
								display: 'block',
								position: 'absolute',
								top: 0,
								left: '50%',
								width: 10,
								height: 10,
								bgcolor: 'background.paper',
								transform: 'translate(-50%, -50%) rotate(45deg)',
								zIndex: 0,
							},
						},
					},
				}}
			>
				<Stack
					direction={'row'}
					divider={<Divider orientation='vertical' flexItem />}
					spacing={1}
					mr={2}
					ml={2}
					overflow={'hidden'}
				>
					{ringType?.hasRotaryPlug && (
						<List sx={{ maxWidth: '200px', maxHeight: '450px', overflow: 'auto' }}>
							<ListSubheader sx={{ color: '#000', fontSize: '1rem', fontWeight: 'bold' }}>
								Конструкция
							</ListSubheader>
							{rotaryPlugData.map((r, i) => (
								<ListItemButton
									key={r.id}
									selected={rotaryPlug == r.code}
									onClick={selectRotaryPlug}
									data-index={i}
									sx={{ borderRadius: '12px' }}
								>
									{r.code}
									{/* - {r.title} */}
								</ListItemButton>
							))}
						</List>
					)}
					<List sx={{ maxWidth: '200px', maxHeight: '450px', overflow: 'auto' }}>
						<ListSubheader sx={{ color: '#000', fontSize: '1rem', fontWeight: 'bold' }}>
							Исполнение
						</ListSubheader>
						{ringsType.map((r, i) => (
							<ListItemButton
								key={r.id}
								selected={ringType?.id == r.id}
								onClick={selectTypeRings}
								data-index={i}
								sx={{ borderRadius: '12px' }}
							>
								{r.title}
							</ListItemButton>
						))}
					</List>
					{ringType?.hasDensity && (
						<List sx={{ maxWidth: '200px', maxHeight: '450px', overflow: 'auto' }}>
							<ListSubheader sx={{ color: '#000', fontSize: '1rem', fontWeight: 'bold' }}>
								Плотность
							</ListSubheader>
							{densityData.map((r, i) => (
								<ListItemButton
									key={r.id}
									selected={density == r.code}
									onClick={selectDensity}
									data-index={i}
									sx={{ borderRadius: '12px' }}
								>
									{r.title}
								</ListItemButton>
							))}
						</List>
					)}
				</Stack>
			</Menu>
		</>
	)
}

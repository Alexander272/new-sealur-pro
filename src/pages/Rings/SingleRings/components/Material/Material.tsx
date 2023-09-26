import { MouseEvent, useEffect, useRef, useState } from 'react'
import { Divider, List, ListItemButton, ListSubheader, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { useGetMaterialsQuery } from '@/store/api/rings'
import { setMaterial, setStep, toggleActiveStep } from '@/store/rings/ring'
import type { IRingMaterial } from '@/types/rings'
import { Step } from '@/pages/Rings/components/Step/Step'
import { RingTooltip } from '@/pages/Rings/components/RingTooltip/RingTooltip'

export const Material = () => {
	const anchor = useRef<HTMLDivElement | null>(null)
	const [open, setOpen] = useState(false)

	const [selected, setSelected] = useState<IRingMaterial | null>(null)

	const ringType = useAppSelector(state => state.ring.ringType)
	const material = useAppSelector(state => state.ring.material)

	const step = useAppSelector(state => state.ring.materialStep)

	const dispatch = useAppDispatch()

	//TODO обработать ошибки
	const { data, isLoading, isError } = useGetMaterialsQuery(ringType?.materialType || '', {
		skip: !ringType?.materialType,
	})

	const openHandler = () => setOpen(true)
	const closeHandler = () => setOpen(false)

	useEffect(() => {
		if (data) {
			const def = data.data.materials.find(m => m.isDefault)

			dispatch(setMaterial(def?.title || ''))
		}
	}, [data])

	const hoverHandler = (event: MouseEvent<HTMLDivElement>) => {
		const { index } = (event.target as HTMLDivElement).dataset
		if (!index) return

		anchor.current = event.target as HTMLDivElement
		setSelected(data?.data.materials[+index] || null)

		openHandler()
	}
	const leaveHandler = () => {
		closeHandler()
	}

	const selectMaterial = (event: MouseEvent<HTMLDivElement>) => {
		const { index } = (event.target as HTMLDivElement).dataset
		if (!index || !data) return

		dispatch(setMaterial(data.data.materials[+index].title))
		dispatch(setStep({ step: 'materialStep', active: false, complete: true }))
		closeHandler()
	}

	const toggleHandler = () => dispatch(toggleActiveStep('materialStep'))

	return (
		<Step label={material || 'ХХХ'} step={step} disabled={isLoading} toggle={toggleHandler}>
			{isError && (
				<Typography paddingX={2} variant='h6' color={'error'} align='center'>
					Не удалось загрузить данные
				</Typography>
			)}

			{!isError && (
				<List
					sx={{
						minWidth: 250,
						maxWidth: 350,
						marginRight: 2,
						marginLeft: 2,
						maxHeight: '450px',
						overflow: 'auto',
						paddingTop: 0,
					}}
				>
					<ListSubheader
						sx={{
							color: '#000',
							fontSize: '1rem',
							fontWeight: 'bold',
							lineHeight: '24px',
							marginTop: 1,
							marginBottom: 1,
						}}
					>
						Материал
					</ListSubheader>
					<Divider sx={{ marginBottom: 1, marginRight: 1, marginLeft: 1 }} />

					{data?.data.materials.map((r, i) => (
						<ListItemButton
							key={r.id}
							selected={material == r.title}
							onClick={selectMaterial}
							onMouseEnter={hoverHandler}
							onMouseLeave={leaveHandler}
							data-index={i}
							sx={{ borderRadius: '12px' }}
						>
							{r.title} {r.description && r.type != 'padding' ? `(${r.description})` : ''}
						</ListItemButton>
					))}
				</List>
			)}

			{selected && selected.type == 'padding' && selected.description ? (
				<RingTooltip open={open} anchor={anchor.current} description={selected?.description} />
			) : null}
		</Step>
	)
}

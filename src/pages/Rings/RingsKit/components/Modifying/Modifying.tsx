import { MouseEvent, useRef, useState } from 'react'
import { Divider, List, ListItemButton, ListSubheader } from '@mui/material'
import { useGetModifyingQuery } from '@/store/api/rings'
import { setModifying, setStep, toggleActiveStep } from '@/store/rings/kit'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import type { IRingModifying } from '@/types/rings'
import { Step } from '../../../components/Step/Step'
import { RingTooltip } from '../../../components/RingTooltip/RingTooltip'

export const Modifying = () => {
	const anchor = useRef<HTMLDivElement | null>(null)
	const [open, setOpen] = useState(false)

	const [selected, setSelected] = useState<IRingModifying | null>(null)

	const modifying = useAppSelector(state => state.kit.modifying)

	const step = useAppSelector(state => state.kit.modifyingStep)

	const dispatch = useAppDispatch()

	const { data } = useGetModifyingQuery(null)

	const openHandler = () => setOpen(true)
	const closeHandler = () => setOpen(false)

	const toggleHandler = () => dispatch(toggleActiveStep('modifyingStep'))

	const hoverHandler = (event: MouseEvent<HTMLDivElement>) => {
		const { index } = (event.target as HTMLDivElement).dataset
		if (!index) return

		anchor.current = event.target as HTMLDivElement
		setSelected(data?.data.modifying[+index] || null)

		openHandler()
	}
	const leaveHandler = () => {
		closeHandler()
	}

	const selectMaterial = (event: MouseEvent<HTMLDivElement>) => {
		const { index } = (event.target as HTMLDivElement).dataset
		if (!index || !data) return

		if (index == '-1') dispatch(setModifying(null))
		else dispatch(setModifying(data.data.modifying[+index].code))

		dispatch(setStep({ step: 'modifyingStep', active: false, complete: index != '-1' }))

		closeHandler()
	}

	return (
		<Step label={modifying || 'Х'} step={step} toggle={toggleHandler}>
			<List
				sx={{
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
					Модифицирующие добавки
				</ListSubheader>
				<Divider sx={{ marginBottom: 1, marginRight: 1, marginLeft: 1 }} />

				<ListItemButton
					selected={modifying == null}
					onClick={selectMaterial}
					data-index={-1}
					sx={{ borderRadius: '12px' }}
				>
					Без добавок
				</ListItemButton>

				{data?.data.modifying.map((r, i) => (
					<ListItemButton
						key={r.id}
						selected={modifying == r.code}
						onClick={selectMaterial}
						onMouseEnter={hoverHandler}
						onMouseLeave={leaveHandler}
						data-index={i}
						sx={{ borderRadius: '12px' }}
					>
						{r.code} - {r.title}
					</ListItemButton>
				))}
			</List>

			{selected && <RingTooltip open={open} anchor={anchor.current} description={selected?.description} />}
		</Step>
	)
}

import { MouseEvent } from 'react'
import { List, ListItemButton, ListSubheader } from '@mui/material'
import { useGetModifyingQuery } from '@/store/api/rings'
import { setModifying } from '@/store/rings/ring'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { Step } from '../Step/Step'

export const Modifying = () => {
	const modifying = useAppSelector(state => state.ring.modifying)

	const dispatch = useAppDispatch()

	const { data } = useGetModifyingQuery(null)

	const selectMaterial = (event: MouseEvent<HTMLDivElement>) => {
		const { index } = (event.target as HTMLDivElement).dataset
		if (!index || !data) return

		if (index == '-1') dispatch(setModifying(null))
		else dispatch(setModifying(data.data.modifying[+index].code))
	}

	return (
		<Step label={modifying || 'Х'} stepName='modifyingStep'>
			<List sx={{ width: 200, marginRight: 2, marginLeft: 2 }}>
				<ListSubheader sx={{ color: '#000', fontSize: '1rem', fontWeight: 'bold', lineHeight: '22px' }}>
					Модифицирующие добавки
				</ListSubheader>

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
						// onMouseEnter={hoverHandler}
						// onMouseLeave={leaveHandler}
						data-index={i}
						sx={{ borderRadius: '12px' }}
					>
						{r.code}
					</ListItemButton>
				))}
			</List>
		</Step>
	)
}

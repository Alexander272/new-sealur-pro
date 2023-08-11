import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { Step } from '../Step/Step'
import { useGetMaterialsQuery } from '@/store/api/rings'
import { MouseEvent, useEffect } from 'react'
import { setMaterial } from '@/store/rings/ring'
import { List, ListItemButton, ListSubheader } from '@mui/material'

export const Material = () => {
	const ringType = useAppSelector(state => state.ring.ringType)
	const material = useAppSelector(state => state.ring.material)

	const dispatch = useAppDispatch()

	const { data } = useGetMaterialsQuery(ringType?.materialType || '', { skip: !ringType?.materialType })

	useEffect(() => {
		if (data) {
			const def = data.data.materials.find(m => m.isDefault)

			dispatch(setMaterial(def?.title || ''))
		}
	}, [data])

	const selectMaterial = (event: MouseEvent<HTMLDivElement>) => {
		const { index } = (event.target as HTMLDivElement).dataset
		if (!index || !data) return

		dispatch(setMaterial(data.data.materials[+index].title))
	}

	return (
		<Step label={material || 'ХХХ'} stepName='materialStep'>
			<List sx={{ width: 200, marginRight: 2, marginLeft: 2, maxHeight: '450px', overflow: 'auto' }}>
				<ListSubheader sx={{ color: '#000', fontSize: '1rem', fontWeight: 'bold' }}>Материал</ListSubheader>
				{data?.data.materials.map((r, i) => (
					<ListItemButton
						key={r.id}
						selected={material == r.title}
						onClick={selectMaterial}
						// onMouseEnter={hoverHandler}
						// onMouseLeave={leaveHandler}
						data-index={i}
						sx={{ borderRadius: '12px' }}
					>
						{r.title}
					</ListItemButton>
				))}
			</List>
		</Step>
	)
}

import { MouseEvent, useEffect } from 'react'
import { Divider, List, ListItemButton, ListSubheader } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { useGetMaterialsQuery } from '@/store/api/rings'
import { setMaterial } from '@/store/rings/ring'
import { Step } from '../Step/Step'

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
						data-index={i}
						sx={{ borderRadius: '12px' }}
					>
						{r.title} {r.description && `(${r.description})`}
					</ListItemButton>
				))}
			</List>
		</Step>
	)
}

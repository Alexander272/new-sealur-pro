import { Divider, Stack } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { setMaterials, toggleActiveStep } from '@/store/rings/kit'
import { Step } from '@/pages/Rings/components/Step/Step'
import { Material } from './components/Material'
import { useGetMaterialsQuery } from '@/store/api/rings'
import { useEffect } from 'react'

export const Materials = () => {
	const construction = useAppSelector(state => state.kit.construction)
	const materials = useAppSelector(state => state.kit.materials)

	const step = useAppSelector(state => state.kit.materialStep)

	const dispatch = useAppDispatch()

	const mats = construction?.materialTypes.split('/') || []

	const { data: fMats } = useGetMaterialsQuery(mats[0] || '', { skip: !mats[0] })
	const { data: sMats } = useGetMaterialsQuery(mats[1] || '', { skip: !mats[1] })

	useEffect(() => {
		if (fMats) {
			const fDef = fMats.data.materials.find(m => m.isDefault)
			const sDef = sMats?.data.materials.find(m => m.isDefault)

			dispatch(setMaterials((fDef?.title || '') + (sDef ? '/' + sDef.title : '')))
		}
	}, [fMats, sMats])

	const toggleHandler = () => dispatch(toggleActiveStep('materialStep'))

	const selectMaterial = (title: string, position: 'first' | 'second') => {
		const parts = materials?.split('/') || []
		if (position == 'first') {
			parts[0] = title
		} else if (parts.length > 1) {
			parts[1] = title
		}
		dispatch(setMaterials(parts.join('/')))
	}

	return (
		<Step label={materials || 'ХХХ/ХХХ'} step={step} toggle={toggleHandler}>
			<Stack direction={'row'} divider={<Divider orientation='vertical' flexItem />} spacing={1} mr={2} ml={2}>
				<Material
					materials={fMats?.data.materials || []}
					material={materials?.split('/')[0] || ''}
					position='first'
					onSelect={selectMaterial}
				/>
				{sMats && (
					<Material
						materials={sMats?.data.materials || []}
						material={materials?.split('/')[1] || ''}
						position='second'
						onSelect={selectMaterial}
					/>
				)}
			</Stack>
		</Step>
	)
}

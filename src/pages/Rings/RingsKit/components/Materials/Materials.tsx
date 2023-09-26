// import { useEffect } from 'react'
import { Divider, Stack, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { setMaterials, toggleActiveStep } from '@/store/rings/kit'
import { useGetMaterialsQuery } from '@/store/api/rings'
import { Step } from '@/pages/Rings/components/Step/Step'
import { Material } from './components/Material'

export const Materials = () => {
	const construction = useAppSelector(state => state.kit.construction)
	const materials = useAppSelector(state => state.kit.materials)

	const step = useAppSelector(state => state.kit.materialStep)

	const dispatch = useAppDispatch()

	const mats = construction?.materialTypes.split('/') || []

	const {
		data: fMats,
		isLoading: fLoading,
		isError: fError,
	} = useGetMaterialsQuery(mats[0] || '', { skip: !mats[0] })
	const {
		data: sMats,
		isLoading: sLoading,
		isError: sError,
	} = useGetMaterialsQuery(mats[1] || '', { skip: !mats[1] })

	const splitIndex = construction?.enabledMaterials?.findIndex(v => v == ';') || -1

	const fEnabledMats =
		splitIndex > -1 ? construction?.enabledMaterials?.slice(0, splitIndex) : construction?.enabledMaterials
	const sEnabledMats =
		splitIndex > -1
			? construction?.enabledMaterials?.slice(splitIndex + 1, construction.enabledMaterials.length)
			: []

	const fFiltersMats = fEnabledMats?.length
		? fMats?.data.materials.filter(m => fEnabledMats.includes(m.title))
		: fMats?.data.materials
	const sFilersMats = sEnabledMats?.length
		? sMats?.data.materials.filter(m => sEnabledMats.includes(m.title))
		: sMats?.data.materials

	// useEffect(() => {
	// 	if (fMats) {
	// 		const fDef = fMats.data.materials.find(m => m.isDefault)
	// 		const sDef = sMats?.data.materials.find(m => m.isDefault)

	// 		dispatch(setMaterials((fDef?.title || '') + (sDef ? '/' + sDef.title : '')))
	// 	}
	// }, [fMats, sMats])

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
		<Step label={materials || 'ХХХ/ХХХ'} step={step} disabled={fLoading || sLoading} toggle={toggleHandler}>
			{fError || sError ? (
				<Typography paddingX={2} variant='h6' color={'error'} align='center'>
					Не удалось загрузить данные
				</Typography>
			) : null}

			{!fError && !sError ? (
				<Stack
					direction={'row'}
					divider={<Divider orientation='vertical' flexItem />}
					spacing={1}
					mr={2}
					ml={2}
				>
					<Material
						label={!sMats ? 'основных колец' : 'замыкающих колец'}
						materials={fFiltersMats || []}
						material={materials?.split('/')[0] || ''}
						position='first'
						onSelect={selectMaterial}
					/>
					{sMats && (
						<Material
							label='основных колец'
							materials={sFilersMats || []}
							material={materials?.split('/')[1] || ''}
							position='second'
							onSelect={selectMaterial}
						/>
					)}
				</Stack>
			) : null}
		</Step>
	)
}

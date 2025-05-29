import { useCallback, useEffect, useState } from 'react'

import { useAppSelector } from '@/hooks/redux'
import { getDesign, getMain, getMaterials, getSize } from '../serratedSlice'

export const useDesignation = () => {
	const [value, setValue] = useState('')

	const main = useAppSelector(getMain)
	const material = useAppSelector(getMaterials)
	const size = useAppSelector(getSize)
	const design = useAppSelector(getDesign)

	const calculateDesignation = useCallback(() => {
		const sizes = [size?.d4, size.d3, size.d2, size?.d1].filter(Boolean).join('x').replaceAll('.', ',')
		const h = (+size.h).toFixed(1).replace('.', ',')

		const designationDesign = []
		if (design.hasHole || design.drawing) designationDesign.push('черт.')
		const designStr = designationDesign.length ? `(${designationDesign.join(', ')}) ` : ''

		const jumper = design.jumper.hasJumper
			? `${design.jumper.code}${design.jumper?.width ? `/${design.jumper.width}` : ''}`
			: ''
		const retainer = design.withRetainer ? 'Ф1' : ''
		const parts = jumper || retainer ? '(' + [jumper, retainer].filter(Boolean).join(', ') + ')' : ''
		const coating = design.hasCoating ? '/СК' : ''

		const materials = [material.base?.code || '0', material.rotaryPlug?.code || '0', material.plating?.code || '0']
		const materialsStr = `-${materials.join('')}`

		const res = `Прокладка ПУТГм-${main.flangeType?.code}-${main.type?.code}-${main.construction?.code}`

		if (main.standard?.standard?.id == '7b6b3272-88d0-4a1a-b6c8-ce07ac7b3255') {
			let mat = ''
			if (!material.base?.isDefault) {
				mat = ' (основание - ' + material.base?.short + ')'
			}

			setValue(
				`Прокладка зубчатая ${main.type?.code}-${size.dn}-${size.pn} ${main.standard.standard.title}${mat}`
			)
			return
		}

		//* ТУ 5728-013-93978201-2008
		if (main.standard?.standard?.id == '47ada632-c4e6-45df-a69e-1faf6dc91910') {
			// == нестандартные фланцы
			if (main.standard?.flangeStandard?.id == '8815fa92-22c2-4f47-92ab-c6d0fea6bdb7') {
				setValue(
					`${res}-${sizes}-${h}${coating}${parts}${materialsStr} ${designStr}${main.standard?.standard?.title}`
				)
				return
			}
			const title = main.standard?.flangeStandard?.title.split(' (')[0]

			setValue(
				`${res}-${size.dn}-${size.pn}-${h}${coating}${parts}${materialsStr} ${designStr}(${sizes}, ${title}) ${main.standard?.standard?.title}`
			)
			return
		}

		setValue(
			`${res}-${size.dn}-${size.pn}-${h}${coating}${parts}${materialsStr} ${designStr}(${sizes}) ${main.standard?.standard?.title}`
		)
	}, [design, main, material, size])

	useEffect(() => {
		calculateDesignation()
	}, [calculateDesignation])

	return value
}

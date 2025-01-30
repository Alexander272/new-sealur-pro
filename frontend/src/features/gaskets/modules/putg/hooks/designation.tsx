import { useCallback, useEffect, useState } from 'react'

import { useAppSelector } from '@/hooks/redux'
import { getDesign, getMain, getMaterials, getSizes } from '../putgSlice'

export const useDesignation = () => {
	const [value, setValue] = useState('')

	const main = useAppSelector(getMain)
	const material = useAppSelector(getMaterials)
	const size = useAppSelector(getSizes)
	const design = useAppSelector(getDesign)

	const calculateDesignation = useCallback(() => {
		const standard = main.standard
		const construction = material.construction

		const sizes = [size?.d4, size.d3, size.d2, size?.d1].filter(Boolean).join('x')
		const h = (+size.h).toFixed(1).replace('.', ',')

		const designationDesign = []
		const form = main.configuration?.code == 'oval' ? 'О' : 'П'
		if (main.configuration?.code != 'round') designationDesign.push(form)
		if (design.hasRemovable) designationDesign.push('разъемная')
		if (design.hasHole || design.drawing) designationDesign.push('черт.')
		const designStr = designationDesign.length ? ` (${designationDesign.join(', ')})` : ''

		const jumper = design.jumper.hasJumper
			? ` (${design.jumper.code}${design.jumper?.width ? `/${design.jumper.width}` : ''})`
			: ''
		const coating = design.hasCoating ? '/СК' : ''

		const materials = [
			material.rotaryPlug?.code || '0',
			material.innerRing?.code || '0',
			material.outerRing?.code || '0',
		]
		let materialsStr = ''
		if (construction?.hasRotaryPlug || construction?.hasInnerRing || construction?.hasOuterRing) {
			materialsStr = `-${materials.join('')}`
		}

		const res = `Прокладка ПУТГ-${main.flangeType?.code}-${material.putgType?.code}-${construction?.code}`

		if (main.configuration?.code != 'round') {
			setValue(`${res}-${sizes}-${h}${coating}${jumper}${materialsStr} ${designStr} ТУ 5728-006-93978201-2008`)
			return
		}

		//* ТУ 5728-006-93978201-2008
		if (standard?.standard.id == '42dca821-6189-445c-877c-87ced7ddf556') {
			// == нестандартные фланцы
			if (standard.flangeStandard.id == '8815fa92-22c2-4f47-92ab-c6d0fea6bdb7') {
				setValue(
					`${res}-${sizes}-${h}${coating}${jumper}${materialsStr} ${designStr} ${standard?.standard.title}`
				)
				return
			}

			setValue(
				`${res}-${size.dn}-${size.pn.mpa}-${h}${coating}${jumper}${materialsStr} ${designStr}(${sizes}) ${standard?.standard.title}`
			)
			return
		}

		let title = standard?.standard.title
		//  == ASME B 16.21 && != ASME B 16.5
		if (
			standard?.standard.id == '2f4150f0-9ab7-409a-815e-6bcc60cb5d86' &&
			standard.flangeStandard.id != '7d832d51-7645-4394-94dc-261959d9e374'
		) {
			title = standard.flangeStandard.title
		}

		setValue(
			`${res}-${size.dn}-${size.pn.mpa}-${h}${coating}${jumper}${materialsStr} ${designStr}(${sizes}, ${title}) ТУ 5728-006-93978201-2008`
		)
	}, [design, main, material, size])

	useEffect(() => {
		calculateDesignation()
	}, [calculateDesignation])

	return value
}

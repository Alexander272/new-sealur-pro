import { useCallback, useEffect, useState } from 'react'

import { useAppSelector } from '@/hooks/redux'
import { getDesign, getMain, getMaterials, getSize } from '../waveSlice'

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
		const form = main.configuration?.code == 'oval' ? 'О' : 'П'
		if (main.configuration?.code != 'round') designationDesign.push(form)
		if (design.hasHole || design.drawing) designationDesign.push('черт.')
		const designStr = designationDesign.length ? `(${designationDesign.join(', ')}) ` : ''

		const jumper = design.jumper.hasJumper
			? `${design.jumper.code}${design.jumper?.width ? `/${design.jumper.width}` : ''}`
			: ''
		const retainer = design.withRetainer ? 'Ф1' : ''
		const parts = jumper || retainer ? '(' + [jumper, retainer].filter(Boolean).join(', ') + ')' : ''
		const coating = design.hasCoating ? '/СК' : ''

		const materials = [material.base?.code || '0', material.rotaryPlug?.code || '0', material.plating?.code || '0']
		let materialsStr = ''
		// if (construction?.hasRotaryPlug || construction?.hasInnerRing || construction?.hasOuterRing) {
		materialsStr = `-${materials.join('')}`
		// }

		const res = `Прокладка ПУТГм-${main.flangeType?.code}-${main.type?.code}-${main.construction?.code}`

		if (main.standard?.standard.id == '793de235-19d6-43e8-9807-4382923235a2') {
			setValue(`${res}-${size.dn}-${size.pnMpa}-${h} (${main.standard.standard.title}) ТУ 5728-013-93978201-2008`)
			return
		}

		// if (main.configuration?.code != 'round') {
		// 	setValue(`${res}-${sizes}-${h}${coating}${jumper}${materialsStr} ${designStr}ТУ 5728-006-93978201-2008`)
		// 	return
		// }

		//* ТУ 5728-013-93978201-2008
		setValue(`${res}-${sizes}-${h}${coating}${parts}${materialsStr} ${designStr} ТУ 5728-013-93978201-2008`)
	}, [design, main, material, size])

	useEffect(() => {
		calculateDesignation()
	}, [calculateDesignation])

	return value
}

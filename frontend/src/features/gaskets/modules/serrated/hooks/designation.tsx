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
		let materialsStr = ''
		// if (construction?.hasRotaryPlug || construction?.hasInnerRing || construction?.hasOuterRing) {
		materialsStr = `-${materials.join('')}`
		// }

		const res = `Прокладка ПУТГм-${main.flangeType?.code}-${main.type?.code}-${main.construction?.code}`

		//* != ТУ 5728-013-93978201-2008
		if (main.standard?.standard?.id != '47ada632-c4e6-45df-a69e-1faf6dc91910') {
			setValue(
				`${res}-${size.dn}-${size.pn}-${h} (${main?.standard?.flangeStandard?.title}) ТУ 5728-013-93978201-2008`
			)
			return
		}

		//* ТУ 5728-013-93978201-2008
		setValue(`${res}-${sizes}-${h}${coating}${parts}${materialsStr} ${designStr} ТУ 5728-013-93978201-2008`)
	}, [design, main, material, size])

	useEffect(() => {
		calculateDesignation()
	}, [calculateDesignation])

	return value
}

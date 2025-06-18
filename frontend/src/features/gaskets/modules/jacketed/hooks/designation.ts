import { useCallback, useEffect, useState } from 'react'

import { useAppSelector } from '@/hooks/redux'
import { getDesign, getMain, getMaterials, getSize } from '../jacketedSlice'

export const useDesignation = () => {
	const [value, setValue] = useState('')

	const main = useAppSelector(getMain)
	const material = useAppSelector(getMaterials)
	const size = useAppSelector(getSize)
	const design = useAppSelector(getDesign)

	const calculateDesignation = useCallback(() => {
		const standard = main.standard
		const construction = main.construction

		const sizes = [size?.d4, size.d3, size.d2, size?.d1].filter(Boolean).join('x').replaceAll('.', ',')
		const h = (+size.h).toFixed(1).replace('.', ',')

		const designationDesign = []
		if (design.drawing) designationDesign.push('черт.')
		const designStr = designationDesign.length ? `(${designationDesign.join(', ')}) ` : ''

		const jumper = design.jumper.hasJumper
			? `(${design.jumper.code}${design.jumper?.width ? `/${design.jumper.width}` : ''})`
			: ''

		const materials = ['0', material.shell?.code || '0', '0']
		let materialsStr = ''
		materialsStr = `-${materials.join('')}`

		const flCode = main.flangeType?.code ? main.flangeType?.code + '-' : ''

		const res = `Прокладка ПУТГ-${flCode}${main.type?.code}-${construction?.code}`

		if (main.standard?.standard?.id == '226d1033-f04c-462c-9196-b426eb338f8b') {
			setValue(
				`Прокладка ${material.shell?.code}-${size.dn}-${size.pn}-${material.filler?.code} ${jumper} ${main.standard.standard.title}`
			)
			return
		}

		//* ТУ 5728-006-93978201-2008
		setValue(`${res}-${sizes}-${h}${jumper}${materialsStr} ${designStr} ${standard?.standard?.title}`)
	}, [design, main, material, size])

	useEffect(() => {
		calculateDesignation()
	}, [calculateDesignation])

	return value
}

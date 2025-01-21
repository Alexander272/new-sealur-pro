import { useCallback, useEffect, useState } from 'react'

import { useAppSelector } from '@/hooks/redux'
import { getDesign, getMain, getMaterials, getSize } from '../snpSlice'

export const useDesignation = () => {
	const [value, setValue] = useState('')

	const main = useAppSelector(getMain)
	const materials = useAppSelector(getMaterials)
	const size = useAppSelector(getSize)
	const design = useAppSelector(getDesign)

	const calculateDesignation = useCallback(() => {
		let designationMaterials = ''
		let designationDesign = ''
		const designationDesignParts: string[] = []

		let notStandardMaterial = false

		const conditionIr = Boolean(materials.innerRing) && !materials.innerRing?.isDefault
		const conditionFr = Boolean(materials.frame) && !materials.frame?.isDefault
		const conditionOr = Boolean(materials.outerRing) && !materials.outerRing?.isDefault

		if (conditionIr || conditionFr || conditionOr) {
			notStandardMaterial = true
		}

		if (design.jumper.hasJumper) {
			designationDesignParts.push(`${design.jumper.code}${design.jumper?.width ? `/${design.jumper.width}` : ''}`)
		}
		if (design.mounting.hasMounting) {
			designationDesignParts.push(design.mounting.code)
		}
		if (design.hasHole || design.drawing) {
			designationDesignParts.push('черт.')
		}
		if (designationDesignParts.length) {
			designationDesign = `(${designationDesignParts.join(', ')}) `
		}

		if (main.snpStandard?.standard.title === 'ОСТ 26.260.454-99') {
			if (notStandardMaterial) {
				const temp = []
				if (materials.innerRing) temp.push(`вн. кольцо - ${materials.innerRing.code}`)
				if (materials.frame) temp.push(`каркас - ${materials.frame.code}`)
				if (materials.outerRing) temp.push(`нар. кольцо - ${materials.outerRing.code}`)

				designationMaterials = ` (${temp.join(', ')}) `
			}

			let thickness: string | number = size.h != 'another' ? size.h : size.another
			if (thickness) thickness = (+thickness.replace(',', '.'))?.toFixed(1)?.replace('.', ',')

			setValue(
				`Прокладка СНП-${main.snpType?.code}-${materials.filler.code}-${size.d2}-${size.pn.mpa}-${thickness} ${designationDesign}${main.snpStandard.standard.title}${designationMaterials}`
			)
			return
		}
		if (main.snpStandard?.standard.title === 'ГОСТ Р 52376-2005') {
			let y = ''

			if (Boolean(materials.outerRing) && materials.outerRing?.baseCode === '5') y = '-У'
			if (!(conditionIr || conditionFr) && y) {
				notStandardMaterial = false
			}

			const temp = []
			// if (materials.filler.baseCode != '3' && materials.filler.baseCode != '4')
			// 	temp.push(`наполнитель - ${materials.filler.code}`)

			if (notStandardMaterial) {
				if (materials.innerRing) temp.push(`вн. кольцо - ${materials.innerRing.code}`)
				if (materials.frame) temp.push(`каркас - ${materials.frame.code}`)
				if (materials.outerRing) temp.push(`нар. кольцо - ${materials.outerRing.code}`)
			}

			if (temp.length) designationMaterials = ` (${temp.join(', ')}) `

			setValue(
				`Прокладка СНП-${main.snpType?.code}-${size.dn}-${size.pn.kg}${y} ${designationDesign}${main.snpStandard.standard.title}${designationMaterials}`
			)
			return
		}
		if (main.snpStandard?.standard.title === 'ASME B 16.20') {
			const ir = materials.innerRing?.code ? `-I.R. ${materials.innerRing?.code}` : ''
			const fr = `-${materials.frame?.code}/`
			const or = materials.outerRing?.code ? `-O.R. ${materials.outerRing?.code}` : ''

			let flange = ''
			// != ASME B 16.5
			if (main.snpStandard.flangeStandard.id != '7d832d51-7645-4394-94dc-261959d9e374') {
				flange = `${main.snpStandard.flangeStandard.title} `
			}

			setValue(
				`Прокладка СНП-${main.snpType?.code}-${size.dn}-${size.pn.mpa}${ir}${fr}${materials.filler.code}${or} ${designationDesign}${flange}${main.snpStandard.standard.title}`
			)
			return
		}
		if (main.snpStandard?.standard.title === 'EN 12560-2') {
			let fr = ''

			const ir = materials.innerRing?.code ? `${materials.innerRing?.code}-` : ''
			if (materials.innerRing?.code != materials.frame?.code) fr = `${materials.frame?.code}-`
			const or = materials.outerRing?.code ? `-${materials.outerRing?.code}` : ''

			setValue(
				`Gasket ${main.snpStandard.standard.title}-${main.snpType?.code}-DN ${size.dnMm}-Class ${size.pn.mpa}-${ir}${fr}${materials.filler.code}${or} ${designationDesign}`
			)
			return
		}
		if (main.snpStandard?.standard.title === 'ГОСТ 28759.9') {
			const temp = []

			if (notStandardMaterial) {
				if (materials.innerRing) temp.push(`вн. кольцо - ${materials.innerRing.code}`)
				if (materials.frame) temp.push(`каркас - ${materials.frame.code}`)
				if (materials.outerRing) temp.push(`нар. кольцо - ${materials.outerRing.code}`)
			}

			if (temp.length) designationMaterials = ` (${temp.join(', ')}) `

			setValue(
				`Прокладка СНП-${main.snpType?.code}-${materials.filler.code}-${size.dn}-${size.pn.mpa} ${designationDesign}${main.snpStandard.standard.title}${designationMaterials}`
			)
			return
		}
		if (main.snpStandard?.standard.title === 'EN 1514-2') {
			let fr = ''

			const ir = materials.innerRing?.code ? `${materials.innerRing?.code}-` : ''
			if (materials.innerRing?.code != materials.frame?.code) fr = `${materials.frame?.code}-`
			const or = materials.outerRing?.code ? `-${materials.outerRing?.code}` : ''

			setValue(
				`Gasket ${main.snpStandard.standard.title}-${main.snpType?.code}-DN ${size.dn}-PN ${size.pn.kg}-${ir}${fr}${materials.filler.code}${or} ${designationDesign}`
			)
			return
		}
		if (main.snpStandard?.standard.title === 'ТУ 3689-010-93978201-2008') {
			let sizes = ''
			if (size?.d4) sizes += size.d4 + 'x'
			sizes += `${size?.d3}x${size?.d2}`
			if (size?.d1) sizes += 'x' + size.d1

			//TODO стоить выводить пред. толщину, а не пустоту
			let thickness = size.h != 'another' ? size.h : size.another
			if (thickness) thickness = (+thickness.replace(',', '.'))?.toFixed(1)?.replace('.', ',')

			//TODO выводить словами материалы (с 09Г2С не очень получается)

			const temp = []

			if (materials.innerRing && !materials.innerRing.isStandard)
				temp.push(`вн. кольцо - ${materials.innerRing.title}`)
			if (materials.frame && !materials.frame.isStandard) temp.push(`каркас - ${materials.frame.title}`)
			if (materials.outerRing && !materials.outerRing.isStandard)
				temp.push(`нар. кольцо - ${materials.outerRing.title}`)

			let notStandardMaterials = ''
			if (temp.length) notStandardMaterials = ` (${temp.join(', ')}) `

			designationMaterials = `-${materials.innerRing?.code || 0}${materials.frame?.code || 0}${
				materials.outerRing?.code || 0
			}`

			setValue(
				`Прокладка СНП-${main.snpType?.code}-${materials.filler.code}-${sizes}-${thickness}${designationMaterials} ${designationDesign}${main.snpStandard.standard.title}${notStandardMaterials}`
			)
			return
		}

		setValue('')
	}, [design, main, materials, size])

	useEffect(() => {
		calculateDesignation()
	}, [calculateDesignation])

	return value
}

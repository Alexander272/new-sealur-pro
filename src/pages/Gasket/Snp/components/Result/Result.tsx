import { Input } from '@/components/Input/input.style'
import { useAppSelector } from '@/hooks/useStore'
import { ResultContainer } from '@/pages/Gasket/gasket.style'
import { useGetSnpQuery } from '@/store/api'
import { Stack, Typography } from '@mui/material'
import { FC } from 'react'

type Props = {}

export const Result: FC<Props> = () => {
	const main = useAppSelector(state => state.snp.main)
	const size = useAppSelector(state => state.snp.size)
	const materials = useAppSelector(state => state.snp.material)
	const design = useAppSelector(state => state.snp.design)

	const materialIr = useAppSelector(state => state.snp.materialsIr)
	const materialFr = useAppSelector(state => state.snp.materialsFr)
	const materialOr = useAppSelector(state => state.snp.materialsOr)

	const renderDescription = () => {
		let rings
		if (main.snpTypeTitle == 'Д')
			rings = `(с наружным ${materials.or?.title} и внутренним ${materials.ir?.title} ограничительными кольцами), с металлическим каркасом из ленты ${materials.fr?.title}`
		if (main.snpTypeTitle == 'Г')
			rings = `(с наружным ограничительным кольцом ${materials.or?.title}), с металлическим каркасом из ленты ${materials.fr?.title}`
		if (main.snpTypeTitle == 'В')
			rings = `(с внутренним ограничительным кольцом ${materials.ir?.title}), с металлическим каркасом из ленты ${materials.fr?.title}`
		if (main.snpTypeTitle == 'Б' || main.snpTypeTitle == 'А')
			rings = `(без ограничительных колец), с металлическим каркасом из ленты ${materials.fr?.title}`

		let res = `Спирально-навитая прокладка (СНП) по ${main.snpStandard?.standard.title} типа ${main.snpTypeTitle} ${rings} и наполнителем из ${materials.filler.designation}, для применения на фланце "${main.flangeTypeTitle}"`

		// ${fl} с размерами ${sizes}, толщиной ${thick} мм${mount}${hole}${jum}
		return res
	}

	const renderDesignation = () => {
		// const data: any = {
		// 	main,
		// 	size,
		// 	materials,
		// }
		// const format = [
		// 	'СНП-',
		// 	'main.snpTypeCode',
		// 	'-',
		// 	'materials.filler.code',
		// 	'-',
		// 	'size.d2',
		// 	'-',
		// 	'size.pn.mpa',
		// 	'-',
		// 	'size.h',
		// 	' ',
		//     '',
		// 	'main.snpStandard.standard.title',
		// ]

		// const res = format.map(f => {
		// 	if (f.includes('.')) {
		// 		let temp: any = data
		// 		let ok = true

		// 		const parts = f.split('.')
		// 		for (let i = 0; i < parts.length; i++) {
		// 			const element = parts[i]
		// 			temp = temp[element]
		// 			if (!temp) {
		// 				ok = false
		// 				break
		// 			}
		// 		}

		// 		if (ok) return temp
		// 		else return ''
		// 	} else return f
		// })

		// return res.join('')

		let designationMaterials = ''
		let designationDesign = ''
		let designationDesignParts: string[] = []

		let notStandardMaterial = false

		const conditionIr = !!materials.ir && materialIr?.default.id != materials.ir?.id
		const conditionFr = !!materials.fr && materialFr?.default.id != materials.fr?.id
		const conditionOr = !!materials.or && materialOr?.default.id != materials.or?.id

		if (conditionIr || conditionFr || conditionOr) {
			notStandardMaterial = true
		}

		if (design.jumper.hasJumper) {
			designationDesignParts.push(`${design.jumper.code}${design.jumper.width && '/'}${design.jumper.width}`)
		}
		if (design.mounting.hasMounting) {
			designationDesignParts.push(design.mounting.code)
		}
		if (design.hasHole) {
			designationDesignParts.push('черт.')
		}
		if (designationDesignParts.length) {
			designationDesign = `(${designationDesignParts.join(', ')}) `
		}

		if (main.snpStandard?.standard.id === 'b412a73b-13b7-4aea-99c9-10dce3ea43a4') {
			if (notStandardMaterial) {
				let temp = []
				if (materials.ir) temp.push(`вн. кольцо - ${materials.ir.shortRus}`)
				if (materials.fr) temp.push(`каркас - ${materials.fr.shortRus}`)
				if (materials.or) temp.push(`нар. кольцо - ${materials.or.shortRus}`)

				designationMaterials = `(${temp.join(', ')}) `
			}

			return `СНП-${main.snpTypeCode}-${materials.filler.code}-${size.d2}-${size.pn.mpa}-${size.h} ${designationDesign}${designationMaterials}${main.snpStandard.standard.title}`
		}
		if (main.snpStandard?.standard.id === '4df3db32-401f-47d2-b5e7-c8e8d3cd00f1') {
			let y = ''
			if (!!materials.or && materials.or?.shortEn === 'CRS') {
				y = '-У'
			}
			if (!(conditionIr || conditionFr) && y) {
				notStandardMaterial = false
			}

			let temp = []
			if (materials.filler.title != 'F.G.') temp.push(`наполнитель - ${materials.filler.anotherTitle}`)

			if (notStandardMaterial) {
				if (materials.ir) temp.push(`вн. кольцо - ${materials.ir.shortRus}`)
				if (materials.fr) temp.push(`каркас - ${materials.fr.shortRus}`)
				if (materials.or) temp.push(`нар. кольцо - ${materials.or.shortRus}`)
			}

			if (temp.length) designationMaterials = `(${temp.join(', ')}) `

			return `СНП-${main.snpTypeCode}-${size.dn}-${size.pn.kg}${y} ${designationDesign}${designationMaterials}${main.snpStandard.standard.title}`
		}
		if (
			main.snpStandard?.standard.id === '9153785c-2fc5-4b33-a31d-254f42ed20b7' ||
			main.snpStandard?.standard.id === '83eee092-833b-456f-8e8e-735a7a09b357'
		) {
			let ir = ''
			let fr = ''
			let or = ''

			if (notStandardMaterial) {
				ir = `${materials.ir?.shortEn}-`
				if (materials.ir?.shortEn != materials.fr?.shortEn) fr = `${materials.fr?.shortEn}-`
				or = `-${materials.or?.shortEn}`
			}

			return `СНП-${main.snpTypeCode}-${size.dn}"-${size.pn.mpa}#-${ir}${fr}${materials.filler.title}${or} ${designationDesign}${main.snpStandard.standard.title}`
		}
		if (main.snpStandard?.standard.id === 'cc69c6a8-c3b9-48fe-afe2-cca53fdcf96e') {
			let ir = ''
			let fr = ''
			let or = ''

			if (notStandardMaterial) {
				ir = `${materials.ir?.shortEn}-`
				if (materials.ir?.shortEn != materials.fr?.shortEn) fr = `${materials.fr?.shortEn}-`
				or = `-${materials.or?.shortEn}`
			}

			return `СНП-${main.snpTypeCode}-${size.dn}-${size.pn.mpa}-${ir}${fr}${materials.filler.title}${or} ${designationDesign}${main.snpStandard.standard.title}`
		}
		if (main.snpStandard?.standard.id === '954f10c3-81d9-44a1-b790-b412b010c9cc') {
			let sizes = ''
			if (size?.d4) sizes += size.d4 + 'x'
			sizes += `${size?.d3}x${size?.d2}`
			if (size?.d1) sizes += 'x' + size.d1

			if (notStandardMaterial) {
				designationMaterials = `-${materials.ir?.code || 0}${materials.fr?.code || 0}${materials.or?.code || 0}`
			}

			return `СНП-${main.snpTypeCode}-${materials.filler.code}-${sizes}${designationMaterials} ${designationDesign}${main.snpStandard.standard.title}`
		}

		return ''
	}

	return (
		<ResultContainer>
			<Stack direction={'row'} spacing={1} marginBottom={1}>
				<Typography fontWeight='bold' marginRight={1} sx={{ userSelect: 'none' }}>
					Описание:
				</Typography>
				<Typography textAlign='justify' sx={{ userSelect: 'none' }}>
					{renderDescription()}
				</Typography>
			</Stack>

			<Stack direction={'row'} spacing={2} alignItems='center' marginBottom={1}>
				<Typography fontWeight='bold' sx={{ userSelect: 'none' }}>
					Обозначение:
				</Typography>
				<Typography sx={{ userSelect: 'none' }} fontSize={'1.12rem'}>
					{renderDesignation()}
				</Typography>
			</Stack>
			<Input label={'Количество'} size='small' />
		</ResultContainer>
	)
}

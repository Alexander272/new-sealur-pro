import { Stack, Typography } from '@mui/material'

import { useAppSelector } from '@/hooks/redux'
import { getDesign, getMain, getMaterials, getSize } from '../../snpSlice'

export const Description = () => {
	const main = useAppSelector(getMain)
	const materials = useAppSelector(getMaterials)
	const size = useAppSelector(getSize)
	const design = useAppSelector(getDesign)

	const renderDescription = () => {
		//TODO поправлено codeium надо проверять
		const rings =
			main.snpType?.title == 'Д'
				? `(с наружным ${materials.outerRing?.title} и внутренним ${materials.innerRing?.title} ограничительными кольцами)`
				: main.snpType?.title == 'Г'
				? `(с наружным ограничительным кольцом ${materials.outerRing?.title})`
				: main.snpType?.title == 'В'
				? `(с внутренним ограничительным кольцом ${materials.innerRing?.title})`
				: '(без ограничительных колец)'

		const flange = main.snpStandard?.flangeStandard.code ? ` по ${main.snpStandard.flangeStandard.title}` : ''

		const sizes = [size?.d4, size?.d3, size?.d2, size?.d1].filter(Boolean).join('x')

		const thickness = size.h != 'another' ? size.h : size.another

		const mounting = design.mounting.hasMounting ? `, с фиксатором ${design.mounting.code}` : ''

		const hole = design.hasHole ? `, с отверстиями (по чертежу)` : ''

		const jumper = design.jumper.hasJumper
			? `, с перемычкой типа ${design.jumper.code} шириной ${design.jumper.width || 0} мм`
			: ''

		return `Спирально-навитая прокладка (СНП) по ${main.snpStandard?.standard.title} типа ${main.snpType?.title} ${rings}, с металлическим каркасом из ленты ${materials.frame?.title} и наполнителем из ${materials.filler.designation}, для применения на фланце "${main.flangeTypeTitle}"${flange} с размерами ${sizes}, толщиной ${thickness} мм${mounting}${hole}${jumper}`
	}

	return (
		<Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 0, sm: 2 }} marginBottom={2}>
			<Typography fontWeight='bold'>Описание:</Typography>
			<Typography textAlign='justify'>{renderDescription()}</Typography>
		</Stack>
	)
}

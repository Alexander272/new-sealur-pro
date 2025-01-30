import { Stack, Typography } from '@mui/material'

import { useAppSelector } from '@/hooks/redux'
import { getDesign, getMain, getMaterials, getSizes } from '../../putgSlice'

export const Description = () => {
	const main = useAppSelector(getMain)
	const material = useAppSelector(getMaterials)
	const size = useAppSelector(getSizes)
	const design = useAppSelector(getDesign)

	const renderDescription = () => {
		let form = ''
		if (main.configuration?.code !== 'round') {
			form = main.configuration?.code == 'oval' ? 'овальной формы ' : 'прямоугольной формы '
		}

		const materials = (material.construction?.description || '')
			.replace('@rotary_plug', material.rotaryPlug?.title || '')
			.replace('@inner_ring', material.innerRing?.title || '')
			.replace('@outer_ring', material.outerRing?.title || '')

		let coating = ''
		if (design.hasCoating) coating = ' с элементом для крепления на поверхности'

		// let mounting = ''
		// if (design.mounting.hasMounting) mounting = `, с фиксатором ${design.mounting.code}`

		const hole = design.hasHole ? `, с отверстиями (по чертежу)` : ''

		const jumper = design.jumper.hasJumper
			? `, с перемычкой типа ${design.jumper.code} шириной ${design.jumper.width || 0} мм`
			: ''

		const removable = design.hasRemovable ? ', разъемная' : ''

		const sizes = [size?.d4, size.d3, size.d2, size?.d1].filter(Boolean).join('x')
		const fullSizes = `${sizes}-${size.h.replace('.', ',')} мм`

		return `Прокладка ${form}из ${material.filler?.designation}, ${material.putgType?.description}, ${materials}, для уплотнения фланцевой поверхности исполнения "${main.flangeType?.title}"${coating}${hole}${jumper}${removable}, с размерами ${fullSizes}`
	}

	return (
		<Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 0, sm: 2 }} marginBottom={2}>
			<Typography fontWeight='bold'>Описание:</Typography>
			<Typography textAlign='justify'>{renderDescription()}</Typography>
		</Stack>
	)
}

import { Stack, Typography } from '@mui/material'

import { useAppSelector } from '@/hooks/redux'
import { getDesign, getMain, getMaterials, getSize } from '../../serratedSlice'

export const Description = () => {
	const main = useAppSelector(getMain)
	const material = useAppSelector(getMaterials)
	const size = useAppSelector(getSize)
	const design = useAppSelector(getDesign)

	const renderDescription = () => {
		const type = (main.type?.description || '')
			.replace('@material', material.base?.title || '')
			.replace('@plating', material.plating?.title || '')
		const materials = (main.construction?.description || '').replace(
			'@rotary_plug',
			material.rotaryPlug?.title || ''
		)

		const coating = design.hasCoating ? ', с элементом для крепления на поверхности' : ''
		const hole = design.hasHole ? `, с отверстиями (по чертежу)` : ''
		const jumper = design.jumper.hasJumper
			? `, с перемычкой типа ${design.jumper.code} шириной ${design.jumper.width || 0} мм`
			: ''
		const retainer = design.withRetainer
			? ', с дополнительным крепежом на вертикальном фланце (фиксатором) формы Ф1'
			: ''

		const sizes = [size?.d4, size.d3, size.d2, size?.d1].filter(Boolean).join('x')
		const fullSizes = `${sizes}-${size.h.replace('.', ',')} мм`
		let standard = ''
		if (main.standard?.standard?.id == '793de235-19d6-43e8-9807-4382923235a2') {
			standard = `, на условный проход ${size.dn} мм, номинальное давление ${size.pn} МПа по ${main.standard?.standard.title}`
		}
		const sizeStr = sizes ? `, с размерами ${fullSizes}` : ''

		return `Прокладка для уплотнения фланцевого соединения типа «${main.flangeType?.title}» ${type}, ${materials}${coating}${hole}${retainer}${jumper}${standard}${sizeStr}`
	}

	return (
		<Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 0, sm: 2 }} marginBottom={2}>
			<Typography fontWeight='bold'>Описание:</Typography>
			<Typography textAlign='justify'>{renderDescription()}</Typography>
		</Stack>
	)
}

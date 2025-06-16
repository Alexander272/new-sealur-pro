import { Stack, Typography } from '@mui/material'

import { useAppSelector } from '@/hooks/redux'
import { getMain, getMaterials, getSize } from '../../jacketedSlice'

export const Description = () => {
	const main = useAppSelector(getMain)
	const material = useAppSelector(getMaterials)
	const size = useAppSelector(getSize)
	// const design = useAppSelector(getDesign)

	const renderDescription = () => {
		const materials = (main.construction?.description || '').replace('@shell', material.shell?.title || '')

		const sizes = [size?.d4, size.d3, size.d2, size?.d1].filter(Boolean).join('x')
		const fullSizes = `${sizes}-${size.h.replace('.', ',')} мм`
		let standard = ''
		if (main.standard?.standard?.id == '226d1033-f04c-462c-9196-b426eb338f8b') {
			standard = `, на условный проход ${size.dn} мм, номинальное давление ${size.pn} МПа по ${main.standard?.standard.title}`
		}

		return `Прокладка из ${material.filler?.designation}, ${main.type?.description}, ${materials}, для уплотнения фланцевой поверхности исполнения "${main.flangeType?.title}"${standard}, с размерами ${fullSizes}`
	}

	return (
		<Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 0, sm: 2 }} marginBottom={2}>
			<Typography fontWeight='bold'>Описание:</Typography>
			<Typography textAlign='justify'>{renderDescription()}</Typography>
		</Stack>
	)
}

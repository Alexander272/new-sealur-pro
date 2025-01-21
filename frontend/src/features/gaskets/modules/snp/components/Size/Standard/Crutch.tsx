import { Typography } from '@mui/material'

import { useAppSelector } from '@/hooks/redux'
import { getDn, getSnpTypeId } from '@/features/gaskets/modules/snp/snpSlice'

export const Crutch = () => {
	const snp = useAppSelector(getSnpTypeId)
	const dn = useAppSelector(getDn)

	// type А and type Г
	const ok = snp == '7b774b8a-790f-46f0-822c-3813c5fcdf30' || snp == '657ba250-6754-4511-b139-b1fcbcfe30fe'
	if (!ok || +dn <= 50) return null

	return (
		<Typography align='justify' sx={{ p: 1, color: 'var(--danger-color)', fontSize: '1.1rem' }}>
			Данный тип СНП свыше Dy 50 не предусмотрен ГОСТ Р 52376-2005, настоятельно рекомендуем выбирать тип с
			внутренним ограничительным кольцом!
		</Typography>
	)
}

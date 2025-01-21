import { useAppSelector } from '@/hooks/redux'
import { getSize, getSnpType, getStandard } from '@/features/gaskets/modules/snp/snpSlice'
import { SizesBlock } from './Block'

const sizePositionsSnp = Object.freeze({
	Д: {
		frame: { top: '2%', left: '79%' },
		ring: { top: '2%', left: '7%' },
		twisted: { top: '2%', left: '19%' },
		d4: { top: '78%' },
		d3: { top: '65%' },
		d2: { top: '52%' },
		d1: { top: '39%' },
	},
	Г: {
		frame: { top: '2%', left: '79%' },
		ring: { top: '2%', left: '7%' },
		twisted: { top: '2%', left: '19%' },
		d4: { top: '78%' },
		d3: { top: '65%' },
		d2: { top: '52%' },
	},
	В: {
		ring: { top: '2%', left: '79%' },
		twisted: { top: '2%', left: '9%' },
		frame: { top: '2%', left: '22%' },
		d3: { top: '77%' },
		d2: { top: '61%' },
		d1: { top: '46%' },
	},
	Б: {
		frame: { top: '2%', left: '83%' },
		twisted: { top: '2%', left: '14%' },
		d3: { top: '77%' },
		d2: { top: '61%' },
	},
	А: {
		frame: { top: '2%', left: '83%' },
		twisted: { top: '2%', left: '14%' },
		d3: { top: '77%' },
		d2: { top: '61%' },
	},
})

export const SizesBlockSnp = () => {
	const snp = useAppSelector(getSnpType)
	const standard = useAppSelector(getStandard)
	const sizes = useAppSelector(getSize)

	if (!snp) return null

	return (
		<SizesBlock
			sizes={sizes}
			hasSizes={snp}
			hasD2={standard?.hasD2}
			positions={sizePositionsSnp[snp.title as 'Д']}
		/>
	)
}

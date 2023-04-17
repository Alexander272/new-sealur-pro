import { useAppSelector } from '@/hooks/useStore'
import { SizesBlock } from '@/components/SizesBlock/SizesBlock'

const sizePositionsSnp = {
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
}

export const SizesBlockSnp = () => {
	const main = useAppSelector(state => state.snp.main)
	const sizes = useAppSelector(state => state.snp.size)

	if (!main.snpType?.title) return null

	return (
		<>
			<SizesBlock
				sizes={sizes}
				hasSizes={main.snpType!}
				hasD2={main.snpStandard?.hasD2}
				positions={sizePositionsSnp[main.snpType.title as 'Д']}
			/>
		</>
	)
}

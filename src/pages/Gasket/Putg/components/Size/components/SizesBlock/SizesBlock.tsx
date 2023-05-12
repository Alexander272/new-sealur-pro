import { useAppSelector } from '@/hooks/useStore'
import { SizesBlock } from '@/components/SizesBlock/SizesBlock'

const sizePositionsPutg = {}

export const SizesBlockPutg = () => {
	const main = useAppSelector(state => state.putg.main)
	const sizes = useAppSelector(state => state.putg.size)

	// if (!main.snpType?.title) return null

	return (
		<>
			{/* <SizesBlock
				sizes={sizes}
				hasSizes={main.snpType!}
				hasD2={main.snpStandard?.hasD2} positions={{
					frame: {
						top: undefined,
						left: undefined
					},
					d4: {
						top: undefined,
						left: undefined
					},
					d3: {
						top: undefined,
						left: undefined
					},
					d2: {
						top: undefined,
						left: undefined
					},
					d1: {
						top: undefined,
						left: undefined
					}
				}}				// positions={sizePositionsSnp[main.snpType.title as 'Д']}
			/> */}
		</>
	)
}

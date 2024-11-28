import { useAppSelector } from '@/hooks/redux'
import { getMaterials, getSnpType } from '@/features/gaskets/modules/snp/snpSlice'
import { Backlight } from '@/components/Backlight/Backlight'

const backlightPositionSnp = Object.freeze({
	Д: {
		outerRing: [
			{ id: 'd-ir-l', top: '20%', left: '1%', width: '38px', height: '24px' },
			{ id: 'd-ir-r', top: '20%', left: '92.5%', width: '38px', height: '24px' },
		],
		frame: [
			{ id: 'd-fr-l', top: '20%', left: '8%', width: '80px', height: '24px' },
			{ id: 'd-fr-r', top: '20%', left: '76%', width: '80px', height: '24px' },
		],
		innerRing: [
			{ id: 'd-or-l', top: '21%', left: '24%', width: '38px', height: '18px' },
			{ id: 'd-or-r', top: '21%', left: '70%', width: '38px', height: '18px' },
		],
	},
	Г: {
		outerRing: [
			{ id: 'g-ir-l', top: '20%', left: '1%', width: '38px', height: '24px' },
			{ id: 'g-ir-r', top: '20%', left: '92.5%', width: '38px', height: '24px' },
		],
		frame: [
			{ id: 'g-fr-l', top: '20%', left: '8%', width: '80px', height: '24px' },
			{ id: 'g-fr-r', top: '20%', left: '76%', width: '80px', height: '24px' },
		],
	},
	В: {
		innerRing: [
			{ id: 'V-ir-l', top: '22%', left: '19%', width: '38px', height: '24px' },
			{ id: 'v-ir-r', top: '22%', left: '73%', width: '38px', height: '24px' },
		],
		frame: [
			{ id: 'v-fr-l', top: '22%', left: '1%', width: '88px', height: '28px' },
			{ id: 'v-fr-r', top: '22%', left: '80%', width: '88px', height: '28px' },
		],
	},
	Б: {
		frame: [
			{ id: 'v-fr-l', top: '22%', left: '1%', width: '88px', height: '28px' },
			{ id: 'v-fr-r', top: '22%', left: '80%', width: '88px', height: '28px' },
		],
	},
	А: {
		frame: [
			{ id: 'v-fr-l', top: '22%', left: '1%', width: '88px', height: '28px' },
			{ id: 'v-fr-r', top: '22%', left: '80%', width: '88px', height: '28px' },
		],
	},
})

export const BacklightSnp = () => {
	const snp = useAppSelector(getSnpType)
	const material = useAppSelector(getMaterials)

	return (
		<>
			{/* // блок зависит от того какой материал открыт и от того какой тип прокладки выбран */}
			{material.openIr && <Backlight blocks={backlightPositionSnp[snp?.title as 'Д']?.innerRing || []} />}
			{material.openFr && <Backlight blocks={backlightPositionSnp[snp?.title as 'Д']?.frame || []} />}
			{material.openOr && <Backlight blocks={backlightPositionSnp[snp?.title as 'Д']?.outerRing || []} />}
		</>
	)
}

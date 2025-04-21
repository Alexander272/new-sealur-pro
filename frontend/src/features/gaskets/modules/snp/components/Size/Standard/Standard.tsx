import { useAppSelector } from '@/hooks/redux'
import { getStandard } from '@/features/gaskets/modules/snp/snpSlice'
import { Dn } from './Dn'
import { D2 } from './D2'
import { Pn } from './Pn'
import { Thickness } from './Thickness'
import { Crutch } from './Crutch'

export const Standard = () => {
	const standard = useAppSelector(getStandard)

	return (
		<>
			<Dn />
			{standard?.hasD2 && <D2 />}
			<Pn />
			<Thickness />
			<Crutch />
		</>
	)
}

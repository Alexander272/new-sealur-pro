import { useAppSelector } from '@/hooks/redux'
import { getSnpTypeId, getStandard } from '@/features/gaskets/modules/snp/snpSlice'
import { useGetSizesQuery } from '@/features/gaskets/modules/snp/snpApiSlice'
import { Dn } from './Dn'
import { D2 } from './D2'
import { Pn } from './Pn'
import { Thickness } from './Thickness'
import { Crutch } from './Crutch'

export const Standard = () => {
	const snp = useAppSelector(getSnpTypeId)
	const standard = useAppSelector(getStandard)

	const { data } = useGetSizesQuery({ typeId: snp, hasD2: standard?.hasD2 }, { skip: snp == 'not_selected' })

	return (
		<>
			<Dn sizes={data?.data || []} />
			{standard?.hasD2 && <D2 sizes={data?.data || []} />}
			<Pn sizes={data?.data || []} />
			<Thickness sizes={data?.data || []} />
			<Crutch />
		</>
	)
}

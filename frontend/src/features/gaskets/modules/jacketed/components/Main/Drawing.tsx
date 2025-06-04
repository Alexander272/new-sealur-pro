import { useAppSelector } from '@/hooks/redux'
import { BaseDrawing } from '@/features/gaskets/components/main/Drawing/Drawing'
import { getFlangeType } from '../../jacketedSlice'

export const Drawing = () => {
	const flange = useAppSelector(getFlangeType)

	return <BaseDrawing flange={flange?.code || '-'} />
}

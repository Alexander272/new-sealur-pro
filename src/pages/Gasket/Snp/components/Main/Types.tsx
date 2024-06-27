import { Typography } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { useGetSnpDataQuery } from '@/store/api/snp'
import { RadioGroup, RadioItem } from '@/components/RadioGroup/RadioGroup'
import { setMainFlangeType, setMainSnpType } from '@/store/gaskets/snp'

export const Types = () => {
	const positionId = useAppSelector(state => state.card.activePosition?.id)
	const snpType = useAppSelector(state => state.snp.main.snpType)
	const standard = useAppSelector(state => state.snp.main.snpStandard)
	const flangeTypeCode = useAppSelector(state => state.snp.main.flangeTypeCode)

	const dispatch = useAppDispatch()

	const { data, isFetching } = useGetSnpDataQuery({
		standardId: standard?.standard.id || '',
		snpStandardId: standard?.id || '',
	})

	const typeHandler = (type: string) => {
		let flangeType = data?.data.flangeTypes.find(
			f => f.code == flangeTypeCode && f.types.some(t => t.title === type)
		)
		if (!flangeType) {
			flangeType = data?.data.flangeTypes.find(f => f.types.some(t => t.title === type))
		}
		if (!flangeType) return

		if (flangeType.code != flangeTypeCode)
			dispatch(setMainFlangeType({ code: flangeType.code, title: flangeType.title }))

		const newType = flangeType.types.find(t => t.title === type)
		dispatch(setMainSnpType({ id: newType!.id, type: newType! }))
	}

	const renderTypes = () => {
		const set = new Set<string>()
		let flangeType = data?.data.flangeTypes[0]
		data?.data.flangeTypes.forEach(f => {
			f.types.forEach(t => set.add(t.title))
			if (f.code == flangeTypeCode) flangeType = f
		})
		const types = Array.from(set)

		return types.map(t => (
			<RadioItem
				key={t}
				value={t}
				active={t === snpType?.title}
				disabled={!flangeType?.types.some(type => type.title == t)}
			>
				{t}
			</RadioItem>
		))
	}

	return (
		<>
			<Typography fontWeight='bold'>Тип СНП</Typography>
			<RadioGroup onChange={typeHandler} disabled={Boolean(positionId) || isFetching}>
				{renderTypes()}
			</RadioGroup>
		</>
	)
}

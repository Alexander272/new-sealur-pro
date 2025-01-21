import { Skeleton, Typography } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getActive } from '@/features/card/cardSlice'
import { RadioGroup, RadioItem } from '@/components/RadioGroup/RadioGroup'
import { useGetFlangeTypesQuery } from '../../snpApiSlice'
import { getFlangeType, getSnpType, getStandardId, setMainFlangeType, setMainSnpType } from '../../snpSlice'

export const Type = () => {
	const active = useAppSelector(getActive)
	const standardId = useAppSelector(getStandardId)
	const flange = useAppSelector(getFlangeType)
	const snp = useAppSelector(getSnpType)

	const dispatch = useAppDispatch()

	const { data, isFetching, isUninitialized } = useGetFlangeTypesQuery(
		{ standardId: standardId },
		{ skip: !standardId || standardId == 'not_selected' }
	)

	const typeHandler = (type: string) => {
		let flangeType = data?.data.find(f => f.code == flange && f.types.some(t => t.title === type))
		if (!flangeType) {
			flangeType = data?.data.find(f => f.types.some(t => t.title === type))
		}

		if (!flangeType) return

		if (flangeType.code != flange) dispatch(setMainFlangeType({ code: flangeType.code, title: flangeType.title }))

		const newType = flangeType.types.find(t => t.title === type)
		dispatch(setMainSnpType({ id: newType!.id, type: newType! }))
	}

	const renderTypes = () => {
		const set = new Set<string>()
		let flangeType = data?.data[0]
		data?.data.forEach(f => {
			f.types.forEach(t => set.add(t.title))
			if (f.code == flange) flangeType = f
		})

		// const types: string[] = []
		// set.forEach(t => types.push(t))
		const types = Array.from(set)

		// console.log(flangeType)

		return types.map(t => (
			<RadioItem
				key={t}
				value={t}
				active={t === snp?.title}
				disabled={!flangeType?.types.some(type => type.title == t)}
			>
				{t}
			</RadioItem>
		))
	}

	return (
		<>
			<Typography fontWeight='bold'>Тип СНП</Typography>
			{isUninitialized || isFetching ? (
				<Skeleton animation='wave' variant='rounded' height={34} width={200} sx={{ borderRadius: 6 }} />
			) : (
				<RadioGroup onChange={typeHandler} disabled={Boolean(active?.id) || isFetching}>
					{renderTypes()}
				</RadioGroup>
			)}
		</>
	)
}

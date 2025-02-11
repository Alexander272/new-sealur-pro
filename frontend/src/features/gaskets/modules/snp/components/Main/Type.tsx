import { useEffect } from 'react'
import { Skeleton, Typography } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getActive } from '@/features/card/cardSlice'
import { RadioGroup, RadioItem } from '@/components/RadioGroup/RadioGroup'
import { useGetSnpFlangeTypesQuery } from '../../snpApiSlice'
import {
	getFlangeTypeId,
	getSnpType,
	getSnpTypeId,
	getStandardId,
	setMainFlangeType,
	setMainSnpType,
} from '../../snpSlice'

export const Type = () => {
	const active = useAppSelector(getActive)
	const standardId = useAppSelector(getStandardId)
	const flangeId = useAppSelector(getFlangeTypeId)
	const snp = useAppSelector(getSnpType)
	const snpId = useAppSelector(getSnpTypeId)

	const dispatch = useAppDispatch()

	const { data, isFetching, isUninitialized } = useGetSnpFlangeTypesQuery(
		{ standardId: standardId },
		{ skip: !standardId || standardId == 'not_selected' }
	)

	useEffect(() => {
		if (!data || isFetching) return
		const fl = data.data.find(f => f.id === flangeId)
		if (!fl) return
		let idx = fl.types.findIndex(t => t.id === snpId)
		if (idx == -1) idx = fl.types.length - 1
		dispatch(setMainSnpType({ id: fl.types[idx].id, type: fl.types[idx] }))
	}, [data, flangeId, snpId, isFetching, dispatch])

	const typeHandler = (type: string) => {
		let flangeType = data?.data.find(f => f.id == flangeId && f.types.some(t => t.title === type))
		if (!flangeType) {
			flangeType = data?.data.find(f => f.types.some(t => t.title === type))
		}

		if (!flangeType) return

		if (flangeType.id != flangeId)
			dispatch(setMainFlangeType({ id: flangeType.id, code: flangeType.code, title: flangeType.title }))

		const newType = flangeType.types.find(t => t.title === type)
		dispatch(setMainSnpType({ id: newType!.id, type: newType! }))
	}

	const renderTypes = () => {
		const set = new Set<string>()
		let flangeType = data?.data[0]
		data?.data.forEach(f => {
			f.types.forEach(t => set.add(t.title))
			if (f.id == flangeId) flangeType = f
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
			<Typography fontWeight='bold' mt={1}>
				Тип СНП
			</Typography>
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

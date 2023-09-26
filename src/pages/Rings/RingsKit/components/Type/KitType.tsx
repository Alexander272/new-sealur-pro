import { useEffect } from 'react'
import { Box, Divider, Stack, Typography } from '@mui/material'
import { useGetRingsKitQuery } from '@/store/api/rings'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { setStep, toggleActiveStep } from '@/store/rings/kit'
import { Step } from '@/pages/Rings/components/Step/Step'
import { Type } from './components/Type'
import { Constructions } from './components/Constructions'

export const KitType = () => {
	const typeId = useAppSelector(state => state.kit.typeId)
	const type = useAppSelector(state => state.kit.type)
	const construction = useAppSelector(state => state.kit.construction)

	const step = useAppSelector(state => state.kit.typeStep)

	const dispatch = useAppDispatch()

	const { data, isLoading, isError } = useGetRingsKitQuery(null)

	useEffect(() => {
		let ok = Boolean(typeId)
		ok = ok && Boolean(construction?.code)

		if (ok) {
			dispatch(setStep({ step: 'typeStep', active: false, complete: true }))
		}
	}, [typeId, construction])

	const toggleHandler = () => dispatch(toggleActiveStep('typeStep'))

	return (
		<Step
			label={(type || 'ХХХ') + '-' + (construction?.code || 'XX')}
			step={step}
			disabled={isLoading}
			toggle={toggleHandler}
		>
			{isError && (
				<Typography paddingX={2} variant='h6' color={'error'} align='center'>
					Не удалось загрузить данные
				</Typography>
			)}

			{!isError && (
				<Stack
					direction={'row'}
					divider={<Divider orientation='vertical' flexItem />}
					spacing={1}
					mr={2}
					ml={2}
				>
					<Type types={data?.data.ringsKitTypes || []} />

					{typeId != '' && (
						<Constructions constructions={data?.data?.constructionMap[typeId]?.constructions || []} />
					)}
				</Stack>
			)}
		</Step>
	)
}

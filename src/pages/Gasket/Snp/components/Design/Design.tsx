import { MenuItem, Select, SelectChangeEvent, Stack, Typography } from '@mui/material'
import { ChangeEvent, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { clearMaterialAndDesign, setHasHole, setDesignJumper, setDesignMounting } from '@/store/gaskets/snp'
import { useGetSnpQuery } from '@/store/api'
import { AsideContainer, Image } from '@/pages/Gasket/gasket.style'
import { Checkbox } from '@/components/Checkbox/Checkbox'
import { JumperSelect } from '@/components/Jumper/Jumper'
import { Input } from '@/components/Input/input.style'
import { IMainJumper } from '@/types/jumper'

export const Design = () => {
	const main = useAppSelector(state => state.snp.main)
	const design = useAppSelector(state => state.snp.design)
	const mountings = useAppSelector(state => state.snp.mountings)

	const dispatch = useAppDispatch()

	const { data } = useGetSnpQuery(
		{ typeId: main.snpTypeId, hasD2: main.snpStandard?.hasD2 },
		{ skip: main.snpTypeId == 'not_selected' }
	)

	useEffect(() => {
		if (data) dispatch(clearMaterialAndDesign(data.data.snp))
	}, [data])

	const jumperHandler = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(setDesignJumper({ hasJumper: event.target.checked }))
	}
	const holeHandler = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(setHasHole(event.target.checked))
	}
	const mountingHandler = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(setDesignMounting({ hasMounting: event.target.checked }))
	}

	const jumperSelectHandler = (jumper: IMainJumper) => {
		dispatch(setDesignJumper({ code: jumper.code, hasDrawing: jumper.hasDrawing }))
	}
	const jumperWidthHandler = (event: ChangeEvent<HTMLInputElement>) => {
		const regex = /^[0-9\b]+$/
		if (event.target.value === '' || regex.test(event.target.value)) {
			let value: number | string = +event.target.value
			if (event.target.value === '') value = event.target.value
			dispatch(setDesignJumper({ width: value.toString() }))
		}
	}
	const mountingTitleHandler = (event: SelectChangeEvent<string>) => {
		dispatch(setDesignMounting({ code: event.target.value }))
	}

	return (
		<AsideContainer>
			<Typography fontWeight='bold'>Конструктивные элементы</Typography>
			<Stack direction='row' spacing={2} marginBottom={1}>
				<Checkbox
					id='jumper'
					name='jumper'
					label='Перемычка'
					checked={design.jumper.hasJumper}
					disabled={!data?.data.snp.hasJumper}
					onChange={jumperHandler}
				/>

				{design.jumper.hasJumper && (
					<>
						<JumperSelect value={design.jumper.code} onSelect={jumperSelectHandler} />
						<Input value={design.jumper.width} onChange={jumperWidthHandler} size='small' />
					</>
				)}
			</Stack>

			<Checkbox
				id='holes'
				name='holes'
				label='Отверстия в наруж. ограничителе'
				checked={design.hasHole}
				disabled={!data?.data.snp.hasHole}
				onChange={holeHandler}
			/>

			<Stack direction='row' spacing={2} marginTop={1}>
				<Checkbox
					id='mounting'
					name='mounting'
					label='Крепление на вертикальном фланце'
					checked={design.mounting.hasMounting}
					disabled={!data?.data.snp.hasMounting}
					onChange={mountingHandler}
				/>

				{design.mounting.hasMounting && (
					<Select
						value={design.mounting.code || 'not_selected'}
						onChange={mountingTitleHandler}
						size='small'
						sx={{
							borderRadius: '12px',
						}}
					>
						<MenuItem value='not_selected' disabled>
							Выберите тип крепления
						</MenuItem>
						{mountings?.map(m => (
							<MenuItem key={m.id} value={m.title}>
								{m.title}
							</MenuItem>
						))}
					</Select>
				)}
			</Stack>
		</AsideContainer>
	)
}

import { FC, useEffect } from 'react'
import { FormControl, MenuItem, Select, SelectChangeEvent, Skeleton, Typography } from '@mui/material'

import type { ISnpStandard } from '@/features/gaskets/modules/snp/types/main'
import { useAppSelector } from '@/hooks/redux'
import { getActive } from '@/features/card/cardSlice'

type Props = {
	data: ISnpStandard[]
	isFetching: boolean
	configuration?: string
	value?: string
	onChange: (value: ISnpStandard) => void
	hidden?: boolean
}

export const Standards: FC<Props> = ({ data, isFetching, value, onChange, configuration, hidden }) => {
	const active = useAppSelector(getActive)

	useEffect(() => {
		if (!data || active?.id || isFetching) return
		onChange(data[0])
	}, [data, active, isFetching, onChange])
	useEffect(() => {
		if (!data || !active || isFetching) return
		let idx = data.findIndex(c => c.id === value)
		if (idx == -1) idx = 0
		onChange(data[idx])
	}, [data, active, isFetching, value, onChange])

	useEffect(() => {
		if (!data || active?.id || isFetching) return
		if (configuration && configuration != 'round') onChange(data[data.length - 1])
		else onChange(data[0])
	}, [data, active, configuration, isFetching, onChange])

	const standardHandler = (event: SelectChangeEvent<string>) => {
		const standard = data.find(s => s.id === event.target.value)
		if (!standard) return
		onChange(standard)
	}

	if (hidden) return null
	return (
		<>
			<Typography fontWeight='bold' mt={1}>
				Стандарт на прокладку / стандарт на фланец
			</Typography>
			{isFetching ? (
				<Skeleton animation='wave' variant='rounded' height={41} sx={{ borderRadius: 3 }} />
			) : (
				<FormControl size='small'>
					<Select
						value={value || 'not_selected'}
						onChange={standardHandler}
						disabled={Boolean(active?.id) || isFetching}
					>
						<MenuItem disabled value='not_selected'>
							<Typography
								sx={{
									display: 'flex',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									width: '100%',
									gap: '2%',
								}}
							>
								<Typography variant='body1' component='span' sx={{ flexBasis: '50%' }}>
									Стандарт на прокладку
								</Typography>

								<Typography
									variant='body1'
									component='span'
									sx={{ flexBasis: '50%', overflow: 'hidden', textOverflow: 'ellipsis' }}
								>
									Стандарт на фланец
								</Typography>
							</Typography>
						</MenuItem>

						{data.map(s => (
							<MenuItem key={s.id} value={s.id}>
								<Typography
									sx={{
										display: 'flex',
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										width: '100%',
										gap: '2%',
									}}
								>
									<Typography
										variant='body1'
										component='span'
										sx={{ flexBasis: '50%', overflow: 'hidden', textOverflow: 'ellipsis' }}
									>
										{s.standard.title}
									</Typography>

									<Typography
										variant='body1'
										component='span'
										sx={{ flexBasis: '50%', overflow: 'hidden', textOverflow: 'ellipsis' }}
									>
										{s.flangeStandard.title}
									</Typography>
								</Typography>
							</MenuItem>
						))}
					</Select>
				</FormControl>
			)}
		</>
	)
}

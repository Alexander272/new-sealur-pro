import { useState } from 'react'
import { Breadcrumbs, Stack, Typography } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
import 'dayjs/locale/ru'

import { PathRoutes } from '@/constants/routes'
import { Breadcrumb } from '@/components/Breadcrumb/Breadcrumb'
import { OrderStatistics } from '@/features/analytics/components/OrdersStatistics/OrderStatistics'
import { UsersStatistics } from '@/features/analytics/components/UsersStatistics/UsersStatistics'
import { UsersStatisticsWithPeriod } from '@/features/analytics/components/UsersStatistics/UsersStatisticsWithPeriod'
import { GroupedOrders } from '@/features/analytics/components/OrdersStatistics/GroupedOrders'

dayjs.extend(quarterOfYear)
dayjs.locale('ru')

export default function Analytics() {
	console.log(useState(dayjs().startOf('Q')))

	const [start, setStart] = useState(dayjs().startOf('Q'))
	const [end, setEnd] = useState(dayjs().endOf('Q'))

	const startHandler = (value: Dayjs | null) => {
		if (value) setStart(value)
	}
	const endHandler = (value: Dayjs | null) => {
		if (value) setEnd(value)
	}

	return (
		<Stack mx={'auto'} width={'100%'} maxWidth={1680}>
			<Stack
				mb={3}
				sx={{
					position: 'relative',
					background: '#fff',
					borderRadius: 2,
					py: 2,
					px: 2,
					boxShadow: '0px 0px 4px 0px #2626262b;',
				}}
			>
				<Breadcrumbs aria-label='breadcrumb' sx={{ mb: -4, position: 'relative', zIndex: 20, width: 300 }}>
					<Breadcrumb to={PathRoutes.Home}>Главная</Breadcrumb>
					<Breadcrumb to={PathRoutes.Manager.Analytics.Base} active>
						Статистика
					</Breadcrumb>
				</Breadcrumbs>

				<Typography variant='h5' textAlign={'center'} mb={0.5}>
					Поступление заявок с использованием "SealurPro"
				</Typography>
			</Stack>

			<Stack
				direction={'row'}
				spacing={2}
				mb={2}
				sx={{
					position: 'relative',
					background: '#fff',
					borderRadius: 2,
					py: 2,
					px: 2,
					boxShadow: '0px 0px 4px 0px #2626262b;',
				}}
			>
				<UsersStatistics />
				<OrderStatistics />
			</Stack>

			<Stack
				spacing={2}
				mb={2}
				sx={{
					position: 'relative',
					background: '#fff',
					borderRadius: 2,
					py: 2,
					px: 2,
					boxShadow: '0px 0px 4px 0px #2626262b;',
				}}
			>
				<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='ru'>
					<Stack direction='row' spacing={2} justifyContent={'center'} alignItems='center'>
						<Typography>За период с</Typography>
						<DatePicker
							value={start}
							onChange={startHandler}
							showDaysOutsideCurrentMonth
							fixedWeekNumber={6}
							minDate={dayjs('2022-01-01')}
						/>

						<Typography>по</Typography>
						<DatePicker
							value={end}
							onChange={endHandler}
							showDaysOutsideCurrentMonth
							fixedWeekNumber={6}
							minDate={dayjs('2022-01-01')}
						/>
					</Stack>
				</LocalizationProvider>

				<UsersStatisticsWithPeriod from={start.unix().toString()} to={end.unix().toString()} />
			</Stack>

			<Stack
				sx={{
					position: 'relative',
					background: '#fff',
					borderRadius: 2,
					py: 2,
					px: 2,
					boxShadow: '0px 0px 4px 0px #2626262b;',
				}}
			>
				<GroupedOrders from={start.unix().toString()} to={end.unix().toString()} />
			</Stack>
		</Stack>
	)
}

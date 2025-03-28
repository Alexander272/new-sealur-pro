import { FC } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import type { IUserParams } from '../../types/analytics'
import { PathRoutes } from '@/constants/routes'
import { FormatNumber } from '@/utils/numbers'
import { Fallback } from '@/components/Fallback/Fallback'
import { useGetUsersStatsQuery } from '../../analyticsApiSlice'
import { HoverCell } from '../styled/HoverCell'

type Props = {
	from: string
	to: string
}

export const UsersStatisticsWithPeriod: FC<Props> = ({ from, to }) => {
	const navigate = useNavigate()
	const { data, isFetching } = useGetUsersStatsQuery({ from, to }, { skip: !from || !to })

	const navigateHandler = (req?: IUserParams) => () => {
		navigate(PathRoutes.Manager.Analytics.Users, { state: req })
	}

	return (
		<TableContainer>
			{isFetching && <Fallback />}

			<Table>
				<TableHead>
					<TableRow>
						<TableCell align='center'>Компаний зарегистрировалось</TableCell>
						<TableCell align='center'>Пользователей зарегистрировалось</TableCell>
						<TableCell align='center'>Пользователей зарегистрировалось (от менеджера)</TableCell>
						<TableCell align='center'>Пользователей зарегистрировалось (с сайта)</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					<TableRow>
						<TableCell align='center'>{FormatNumber(data?.data.companyCount)}</TableCell>
						<HoverCell align='center' onClick={navigateHandler({ from, to })}>
							{FormatNumber(data?.data.usersCount)}
						</HoverCell>
						<HoverCell align='center' onClick={navigateHandler({ from, to, fromManager: true })}>
							{FormatNumber(data?.data.usersFromManager)}
						</HoverCell>
						<HoverCell align='center' onClick={navigateHandler({ from, to, fromManager: false })}>
							{FormatNumber(data ? data.data.usersCount - data.data.usersFromManager : 0)}
						</HoverCell>
					</TableRow>
				</TableBody>
			</Table>
		</TableContainer>
	)
}

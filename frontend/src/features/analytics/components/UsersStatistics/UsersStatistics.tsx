import { Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import type { IUserParams } from '../../types/analytics'
import { PathRoutes } from '@/constants/routes'
import { FormatNumber } from '@/utils/numbers'
import { Fallback } from '@/components/Fallback/Fallback'
import { useGetUsersStatsQuery } from '../../analyticsApiSlice'

export const UsersStatistics = () => {
	const navigate = useNavigate()
	const { data, isFetching } = useGetUsersStatsQuery(null)

	const navigateHandler = (req?: IUserParams) => () => {
		navigate(PathRoutes.Manager.Analytics.Users, { state: req })
	}

	return (
		<TableContainer sx={{ height: '100%' }}>
			{isFetching && <Fallback />}

			<Table>
				<TableBody>
					<TableRow>
						<TableCell>Всего компаний зарегистрировалось</TableCell>
						<TableCell sx={{ fontSize: '18px', fontWeight: 'bold', p: '13px 16px' }}>
							{FormatNumber(data?.data.companyCount)}
						</TableCell>
					</TableRow>
					<TableRow hover onClick={navigateHandler({ confirmed: true })} sx={{ cursor: 'pointer' }}>
						<TableCell>Всего пользователей зарегистрировалось и подтвердило почту</TableCell>
						<TableCell sx={{ fontSize: '18px', fontWeight: 'bold', p: '13px 16px' }}>
							{FormatNumber(data?.data.usersCount)}
						</TableCell>
					</TableRow>
					<TableRow hover onClick={navigateHandler({ confirmed: false })} sx={{ cursor: 'pointer' }}>
						<TableCell>Всего пользователей зарегистрировалось без подтверждения</TableCell>
						<TableCell sx={{ fontSize: '18px', fontWeight: 'bold', p: '13px 16px' }}>
							{FormatNumber(data?.data.notConfirmedUsers)}
						</TableCell>
					</TableRow>
					<TableRow hover onClick={navigateHandler({ fromManager: true })} sx={{ cursor: 'pointer' }}>
						<TableCell>Пользователей зарегистрировалось и подтвердило почту (от менеджера)</TableCell>
						<TableCell sx={{ fontSize: '18px', fontWeight: 'bold', p: '13px 16px' }}>
							{FormatNumber(data?.data.usersFromManager)}
						</TableCell>
					</TableRow>
					<TableRow hover onClick={navigateHandler({ fromManager: false })} sx={{ cursor: 'pointer' }}>
						<TableCell>Пользователей зарегистрировалось и подтвердило почту (с сайта)</TableCell>
						<TableCell sx={{ fontSize: '18px', fontWeight: 'bold', p: '13px 16px' }}>
							{FormatNumber(data ? data?.data.usersCount - data?.data.usersFromManager : 0)}
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</TableContainer>
	)
}

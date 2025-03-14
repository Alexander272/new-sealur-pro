import { FC } from 'react'
import { SxProps, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material'

import { TopFallback } from '@/components/Fallback/TopFallback'
import { useGetUserQuery } from '../../userApiSlice'

type Props = {
	userId: string
	sx?: SxProps
}

export const UserTable: FC<Props> = ({ userId, sx }) => {
	const { data, isFetching } = useGetUserQuery(userId, { skip: !userId })

	return (
		<TableContainer sx={sx}>
			{isFetching && <TopFallback />}

			<Table>
				<TableBody>
					<TableRow>
						<TableCell width={'25%'}>Компания</TableCell>
						<TableCell>{data?.data.company}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Юр. адрес</TableCell>
						<TableCell>{data?.data.address}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>ИНН</TableCell>
						<TableCell>{data?.data.inn}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>КПП</TableCell>
						<TableCell>{data?.data.kpp}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>ФИО</TableCell>
						<TableCell>{data?.data.name}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Должность</TableCell>
						<TableCell>{data?.data.position}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Email</TableCell>
						<TableCell>{data?.data.email}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Телефон</TableCell>
						<TableCell>{data?.data.phone}</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</TableContainer>
	)
}

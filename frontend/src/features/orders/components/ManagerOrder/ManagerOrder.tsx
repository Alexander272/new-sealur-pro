import { FC } from 'react'
import { Stack } from '@mui/material'

import type { IFullOrder } from '../../types/order'
import { ManagersDialog } from '@/features/user/components/ManagersDialog/ManagersDialog'
import { UserTable } from '@/features/user/components/UserTable/UserTable'
import { Positions } from './Positions'

type Props = {
	data: IFullOrder
}

export const ManagerOrder: FC<Props> = ({ data }) => {
	return (
		<Stack direction={'row'} spacing={2} alignItems={'flex-start'}>
			<ManagersDialog />
			<Positions data={data} />

			<UserTable
				userId={data.userId || ''}
				sx={{
					position: 'relative',
					background: '#fff',
					borderRadius: 3,
					py: 1,
					px: 2,
					boxShadow: '0px 0px 4px 0px #2626262b;',
					width: '100%',
					flexShrink: 2,
				}}
			/>
		</Stack>
	)
}

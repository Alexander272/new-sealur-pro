import { FC } from 'react'
import { Stack } from '@mui/material'

import type { Position as PositionType } from '../../types/card'
import { Position } from './Position'

type Props = {
	data: PositionType[]
}

export const Positions: FC<Props> = ({ data }) => {
	return (
		<Stack mt={2} mb={2}>
			{data.map((d, i) => (
				<Position key={d.id} idx={i} data={d} />
			))}
		</Stack>
	)
}

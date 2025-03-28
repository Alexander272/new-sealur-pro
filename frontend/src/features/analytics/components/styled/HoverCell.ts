import { styled, TableCell, TableCellProps } from '@mui/material'

export const HoverCell = styled(TableCell)<TableCellProps>(() => ({
	cursor: 'pointer',
	transition: '0.3s all ease-in-out',
	borderRadius: 12,
	':hover': {
		background: '#eee',
	},
})) as typeof TableCell

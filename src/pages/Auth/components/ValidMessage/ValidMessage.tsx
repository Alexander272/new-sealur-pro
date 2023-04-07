import { FC } from 'react'
import WarningIcon from '@mui/icons-material/Warning'
import { Icon, Item, List, Message } from './message.style'

type Props = {
	messages: string[]
}

export const ValidMessage: FC<Props> = ({ messages }) => {
	return (
		<>
			<Icon>
				<WarningIcon color='error' />
			</Icon>
			<Message>
				<List>
					{messages.map((m, i) => (
						<Item key={i}>{m}</Item>
					))}
				</List>
			</Message>
		</>
	)
}

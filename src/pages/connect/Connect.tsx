import { Typography } from '@mui/material'
import TelegramIcon from '@mui/icons-material/Telegram'

import { FeedbackForm } from '@/features/feedback/components/Form/Form'
import { Container, Links, Link, LinksLine } from './connect.style'

export default function Connect() {
	return (
		<Container>
			<FeedbackForm />

			<Links>
				<Typography variant='h5' align='center'>
					Иные способы связи
				</Typography>
				<LinksLine>
					<Link href='https://t.me/m_alex272' target='_blank'>
						<TelegramIcon sx={{ color: 'white', marginRight: 1 }} /> Telegram
					</Link>
				</LinksLine>
			</Links>
		</Container>
	)
}

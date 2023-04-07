import { Divider, Stack, Typography } from '@mui/material'
import { Container, FileLink, NavLink } from './footer.style'
import MailOutlineIcon from '@mui/icons-material/MailOutline'

export default function Footer() {
	return (
		<Container>
			<Stack
				direction={{ xs: 'column-reverse', sm: 'row' }}
				alignItems={'center'}
				divider={<Divider orientation='vertical' flexItem />}
				spacing={{ xs: 0, sm: 2 }}
			>
				<Typography fontSize={18}>© Sealur</Typography>
				<FileLink
					href='https://sealur.ru/wp-content/uploads/2020/03/politika-silur-v-otnoshenii-personalnyh-dannyh.pdf'
					target='blank'
				>
					Политика конфиденциальности
				</FileLink>

				<NavLink to='/connect'>
					<MailOutlineIcon sx={{ marginRight: 1 }} />
					Связаться с нами
				</NavLink>
			</Stack>
		</Container>
	)
}

import { memo } from 'react'
import { Divider, Stack, Typography } from '@mui/material'
import { Container, FileLink, NavLink } from './footer.style'
import MailOutlineIcon from '@mui/icons-material/MailOutline'

// import Privacy from '@/assets/files/privacy.pdf'
import Policy from '@/assets/files/policy.pdf'

export default memo(function Footer() {
	return (
		<Container>
			<Stack
				direction={{ xs: 'column-reverse', sm: 'row' }}
				alignItems={'center'}
				divider={<Divider orientation='vertical' flexItem />}
				spacing={{ xs: 0, sm: 2 }}
			>
				<Typography fontSize={14}>
					©{' '}
					<FileLink href='https://sealur.ru' target='_blank'>
						Sealur
					</FileLink>
				</Typography>
				<FileLink
					// href='https://sealur.ru/wp-content/uploads/2020/03/politika-silur-v-otnoshenii-personalnyh-dannyh.pdf'
					href={Policy}
					target='blank'
				>
					Политика конфиденциальности
				</FileLink>

				<NavLink to='/connect'>
					<MailOutlineIcon sx={{ marginRight: 1 }} />
					Тех. поддержка
				</NavLink>
			</Stack>
		</Container>
	)
})

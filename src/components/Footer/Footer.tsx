import { Container, FileLink, NavLink } from './footer.style'

export default function Footer() {
	return (
		<Container>
			<p>
				© Sealur |{' '}
				<FileLink
					href='https://sealur.ru/wp-content/uploads/2020/03/politika-silur-v-otnoshenii-personalnyh-dannyh.pdf'
					target='blank'
				>
					Политика конфиденциальности
				</FileLink>{' '}
				| <NavLink to='/connect'>Связаться с нами</NavLink>
			</p>
		</Container>
	)
}

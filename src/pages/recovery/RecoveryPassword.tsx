import { Password } from '@/features/recovery/components/Forms/Password'
import { Base, Container, Wrapper } from '../auth/auth.style'

// страница для ввода нового пароля
export default function RecoveryPassword() {
	return (
		<Base>
			<Wrapper>
				<Container>
					<Password />
				</Container>
			</Wrapper>
		</Base>
	)
}

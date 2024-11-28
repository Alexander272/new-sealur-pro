import { Recovery as RecoveryForm } from '@/features/recovery/components/Forms/Recovery'
import { Base, Container, Wrapper } from '../auth/auth.style'

// страница для запроса на восстановление пароля
export default function Recovery() {
	return (
		<Base>
			<Wrapper>
				<Container>
					<RecoveryForm />
				</Container>
			</Wrapper>
		</Base>
	)
}

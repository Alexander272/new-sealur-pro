import { useInput } from '@/hooks/useInput'
import { FormEvent } from 'react'
import { Button, FormControl, Typography } from '@mui/material'
import { Container, Wrapper, Base } from '../auth.style'
import { Input, Title } from '../components/AuthForms/forms.style'
import { Form } from './reset.style'

export default function Reset() {
	const email = useInput({ validation: 'email' })

	const submitHandler = (event: FormEvent<HTMLFormElement>) => {}

	return (
		<Base>
			<Wrapper>
				<Container>
					<Form onSubmit={submitHandler}>
						<Title open={true}>Восстановление пароля</Title>

						<Typography align='justify' marginTop={2}>
							Укажите свой адрес электронной почты, и мы отправим на него инструкции по восстановлению
							пароля.
						</Typography>
						<FormControl sx={{ marginTop: 3, marginBottom: 2 }}>
							<Input label='email' value={email.value} onChange={email.onChange} size='small' />
						</FormControl>

						<Button
							type='submit'
							variant='contained'
							sx={{ borderRadius: '20px', fontSize: '1rem', fontWeight: 600, marginTop: 4 }}
						>
							Восстановить
						</Button>
					</Form>
				</Container>
			</Wrapper>
		</Base>
	)
}

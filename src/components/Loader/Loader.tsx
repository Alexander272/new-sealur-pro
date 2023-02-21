import { FC } from 'react'
import classes from './loader.module.scss'
import { Container, Spinner } from './loader.style'

type Props = {
	size?: 'small' | 'middle' | 'large'
	background?: 'none' | 'fill'
	isFull?: boolean
}

export const Loader: FC<Props> = ({ size, background = 'none', isFull }) => {
	return (
		<Container background={background} isFull={isFull}>
			<Spinner />
		</Container>
	)
}

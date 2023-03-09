import { FC } from 'react'
import { BacklightBlock, BacklightProps, Container } from './backlight.style'

type Props = {
	blocks: BacklightProps[]
}

export const Backlight: FC<Props> = ({ blocks }) => {
	return (
		<Container>
			{blocks.map(b => (
				<BacklightBlock {...b} />
			))}
		</Container>
	)
}

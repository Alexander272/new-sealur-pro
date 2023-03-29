import { FC } from 'react'
import { BacklightBlock, BacklightProps, Container } from './backlight.style'

type Backlight = {
	id: string
	width: string
	height: string
	top?: string
	left?: string
	background?: string
}

type Props = {
	blocks: Backlight[]
}

export const Backlight: FC<Props> = ({ blocks }) => {
	if (!blocks.length) return null

	return (
		<Container>
			{blocks.map(b => (
				<BacklightBlock key={b.id} {...b} />
			))}
		</Container>
	)
}

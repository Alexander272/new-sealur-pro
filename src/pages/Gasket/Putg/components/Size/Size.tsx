import { FC } from 'react'
import { SizeContainer } from '@/pages/Gasket/gasket.style'

type Props = {}

export const Size: FC<Props> = () => {
	return (
		<SizeContainer rowStart={5} rowEnd={9}>
			Size
		</SizeContainer>
	)
}

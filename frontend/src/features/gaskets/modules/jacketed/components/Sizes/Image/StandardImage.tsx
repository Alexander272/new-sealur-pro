import { FC } from 'react'

import type { IConstruction, IJacketedType } from '../../../types/main'
import { CompositeImage, Image } from '@/features/gaskets/components/Skeletons/gasket.style'

import type200 from '@/assets/putg/200.webp'
import rotary05 from '@/assets/putg/obt_05_2.webp'

type Props = {
	type?: IJacketedType
	construction?: IConstruction
}

export const StandardImage: FC<Props> = () => {
	return (
		<CompositeImage>
			<Image width={512} height={113} src={type200} alt='gasket drawing' />
			<Image
				width={507}
				height={34}
				src={rotary05}
				position='absolute'
				left='0'
				padding='4.7% 0% 0'
				alt='rotary plug drawing'
			/>
		</CompositeImage>
	)
}

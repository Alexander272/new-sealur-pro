import { FC } from 'react'

import type { IConstruction, IPutgType } from '../../../types/putg'
import { CompositeImage, Image } from '@/features/gaskets/components/Skeletons/gasket.style'

import type200 from '@/assets/putg/200_part.webp'
import type210 from '@/assets/putg/210_part.webp'
import type220 from '@/assets/putg/220_part.webp'
import type230 from '@/assets/putg/230_part.webp'
import type240 from '@/assets/putg/240_part.webp'
import type250 from '@/assets/putg/250_part.webp'
import type260 from '@/assets/putg/260_part.webp'

import rotary02 from '@/assets/putg/obt_02_part.webp'
import rotary03 from '@/assets/putg/obt_03_part.webp'
import rotary04 from '@/assets/putg/obt_04_part.webp'
import rotary05 from '@/assets/putg/obt_05_part.webp'

import ring042 from '@/assets/putg/ring_042_part.webp'
import ring043 from '@/assets/putg/ring_043_part.webp'
import ring044 from '@/assets/putg/ring_044_part.webp'

const typeImages = {
	200: type200,
	210: type210,
	220: type220,
	230: type230,
	240: type240,
	250: type250,
	260: type260,
}

const constructionImages = {
	'01': {
		ringUrl: ring044,
		isHidden: true,
	},
	'02': {
		rotaryUrl: rotary02,
		ringUrl: ring044,
		isHidden: true,
	},
	'03': {
		rotaryUrl: rotary03,
		ringUrl: ring044,
		isHidden: true,
	},
	'04': {
		rotaryUrl: rotary04,
		ringUrl: ring044,
		isHidden: true,
	},
	'042': {
		rotaryUrl: rotary04,
		ringUrl: ring042,
		isHidden: false,
	},
	'043': {
		rotaryUrl: rotary04,
		ringUrl: ring043,
		isHidden: false,
	},
	'044': {
		rotaryUrl: rotary04,
		ringUrl: ring044,
		isHidden: false,
	},
	'05': {
		rotaryUrl: rotary05,
		ringUrl: ring044,
		isHidden: true,
	},
}

type Props = {
	type?: IPutgType
	construction?: IConstruction
}

export const NotStandardImage: FC<Props> = ({ type, construction }) => {
	const image = constructionImages[(construction?.code as '044') || '044']

	return (
		<CompositeImage>
			<Image src={typeImages[(type?.typeCode as '200') || '200']} position='absolute' padding='0 0 0 8%' />
			<Image src={image.ringUrl} isHidden={image.isHidden} padding='6% 0 4% 0' />
			{image.rotaryUrl && (
				<Image src={image.rotaryUrl} position='absolute' left='0' maxHeight='76px' padding='6.7% 0% 0% 8%' />
			)}
		</CompositeImage>
	)
}

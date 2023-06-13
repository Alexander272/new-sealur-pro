import { FC } from 'react'
import type { IConstruction, IPutgType } from '@/types/putg'
import { CompositeImage, Image } from '@/pages/Gasket/gasket.style'

import type200 from '@/assets/putg/200.webp'
import type210 from '@/assets/putg/210.webp'
import type220 from '@/assets/putg/220.webp'
import type230 from '@/assets/putg/230.webp'
import type240 from '@/assets/putg/240.webp'
import type250 from '@/assets/putg/250.webp'
import type260 from '@/assets/putg/260.webp'

import rotary02 from '@/assets/putg/obt_02.webp'
import rotary03 from '@/assets/putg/obt_03.webp'
import rotary04 from '@/assets/putg/obt_04.webp'
import rotary05 from '@/assets/putg/obt_05_2.webp'
// import rotary05 from '@/assets/putg/obt_05.webp'

import ring042 from '@/assets/putg/ring_042.webp'
import ring043 from '@/assets/putg/ring_043.webp'
import ring044 from '@/assets/putg/ring_044.webp'

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

export const PutgImage: FC<Props> = ({ type, construction }) => {
	const constructionImage = constructionImages[(construction?.code as '044') || '044']

	return (
		<CompositeImage>
			<Image
				width={466}
				height={162}
				src={typeImages[(type?.typeCode as '200') || '200']}
				position='absolute'
				padding='0 4%'
				alt='gasket drawing'
			/>
			<Image
				width={507}
				height={113}
				src={constructionImage.ringUrl}
				isHidden={constructionImage.isHidden}
				padding='4.3% 0 0 0'
				alt='rings drawing'
			/>
			{constructionImage.rotaryUrl && (
				<Image
					width={466}
					height={33}
					src={constructionImage.rotaryUrl}
					position='absolute'
					left='0'
					padding='4.3% 4% 0'
					alt='rotary plug drawing'
				/>
			)}
		</CompositeImage>
	)
}

import { FC } from 'react'

import type { IConstruction, ISerratedType } from '../../../types/main'
import { Image } from '@/features/gaskets/components/Skeletons/gasket.style'

import type_01_01 from '@/assets/serrated/01-01.webp'
import type_02_01 from '@/assets/serrated/02-01.webp'
import type_03_01 from '@/assets/serrated/03-01.webp'
import type_04_01 from '@/assets/serrated/04-01.webp'

const images = new Map<string, string>([
	['01_01', type_01_01],
	['02_01', type_02_01],
	['03_01', type_03_01],
	['04_01', type_04_01],
])

type Props = {
	type?: ISerratedType
	construction?: IConstruction
}

export const StandardImage: FC<Props> = ({ type, construction }) => {
	return (
		<Image
			width={512}
			height={113}
			src={images.get(`${type?.baseCode}_${construction?.code}`)}
			alt='gasket drawing'
		/>
	)
}

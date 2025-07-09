import { FC } from 'react'

import type { IConstruction, IWaveType } from '../../../types/main'
import { Image } from '@/features/gaskets/components/Skeletons/gasket.style'

import type_09_01 from '@/assets/wave/09-01-part.webp'
import type_09_02 from '@/assets/wave/09-02-part.webp'
import type_09_03 from '@/assets/wave/09-03-part.webp'
import type_09_04 from '@/assets/wave/09-04-part.webp'
import type_092_01 from '@/assets/wave/092-01-part.webp'
import type_092_02 from '@/assets/wave/092-02-part.webp'
import type_092_03 from '@/assets/wave/092-03-part.webp'
import type_092_04 from '@/assets/wave/092-04-part.webp'
import type_093_01 from '@/assets/wave/093-01-part.webp'
import type_093_02 from '@/assets/wave/093-02-part.webp'
import type_093_03 from '@/assets/wave/093-03-part.webp'
import type_093_04 from '@/assets/wave/093-04-part.webp'
import type_095_01 from '@/assets/wave/095-01-part.webp'
import type_095_02 from '@/assets/wave/095-02-part.webp'
import type_095_03 from '@/assets/wave/095-03-part.webp'
import type_095_04 from '@/assets/wave/095-04-part.webp'
import type_098_01 from '@/assets/wave/098-01-part.webp'
import type_098_03 from '@/assets/wave/098-03-part.webp'
import type_099_01 from '@/assets/wave/099-01-part.webp'
import type_099_03 from '@/assets/wave/099-03-part.webp'

const images = new Map<string, string>([
	['09_01', type_09_01],
	['09_02', type_09_02],
	['09_03', type_09_03],
	['09_04', type_09_04],
	['092_01', type_092_01],
	['092_02', type_092_02],
	['092_03', type_092_03],
	['092_04', type_092_04],
	['093_01', type_093_01],
	['093_02', type_093_02],
	['093_03', type_093_03],
	['093_04', type_093_04],
	['095_01', type_095_01],
	['095_02', type_095_02],
	['095_03', type_095_03],
	['095_04', type_095_04],
	['098_01', type_098_01],
	['098_03', type_098_03],
	['099_01', type_099_01],
	['099_03', type_099_03],
])

type Props = {
	type?: IWaveType
	construction?: IConstruction
}

export const NotStandardImage: FC<Props> = ({ type, construction }) => {
	return (
		<Image
			width={400}
			height={137}
			src={images.get(`${type?.baseCode}_${construction?.code}`)}
			alt='gasket drawing'
		/>
	)
}

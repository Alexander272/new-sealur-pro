import { FC } from 'react'

import type { IConstruction, IWaveType } from '../../../types/main'
import { Image } from '@/features/gaskets/components/Skeletons/gasket.style'

import type_09_01 from '@/assets/wave/PM 09-01-01.webp'
import type_09_02 from '@/assets/wave/PM 09-02.webp'
import type_09_03 from '@/assets/wave/PM 09-03.webp'
import type_09_04 from '@/assets/wave/PM 09-04.webp'
import type_091_01 from '@/assets/wave/PM 091-01.webp'
import type_091_02 from '@/assets/wave/PM 091-02.webp'
import type_092_01 from '@/assets/wave/PM 092-01.webp'
import type_092_02 from '@/assets/wave/PM 092-02.webp'
import type_092_04 from '@/assets/wave/PM 092-04.webp'
import type_093_01 from '@/assets/wave/PM 093-01.webp'
import type_093_02 from '@/assets/wave/PM 093-02.webp'
import type_093_03 from '@/assets/wave/PM 093-03.webp'
import type_093_04 from '@/assets/wave/PM 093-04.webp'
import type_095_01 from '@/assets/wave/PM 095-01.webp'
import type_095_02 from '@/assets/wave/PM 095-02.webp'
import type_095_03 from '@/assets/wave/PM 095-03.webp'
import type_095_04 from '@/assets/wave/PM 095-04.webp'
import type_097_01 from '@/assets/wave/PM 097-01.webp'
import type_098_01 from '@/assets/wave/PM 098-01.webp'
import type_099_01 from '@/assets/wave/PM 099-01.webp'

const images = new Map<string, string>([
	['09_01', type_09_01],
	['09_02', type_09_02],
	['09_03', type_09_03],
	['09_04', type_09_04],
	['091_01', type_091_01],
	['091_02', type_091_02],
	['092_01', type_092_01],
	['092_02', type_092_02],
	['092_04', type_092_04],
	['093_01', type_093_01],
	['093_02', type_093_02],
	['093_03', type_093_03],
	['093_04', type_093_04],
	['095_01', type_095_01],
	['095_02', type_095_02],
	['095_03', type_095_03],
	['095_04', type_095_04],
	['097_01', type_097_01],
	['098_01', type_098_01],
	['099_01', type_099_01],
])

type Props = {
	type?: IWaveType
	construction?: IConstruction
}

export const StandardImage: FC<Props> = ({ type, construction }) => {
	return (
		<Image width={512} height={113} src={images.get(`${type?.code}_${construction?.code}`)} alt='gasket drawing' />
	)
}

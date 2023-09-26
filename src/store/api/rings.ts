import type { IRing, IRingMaterial, IRingModifying, IRingSize } from '@/types/rings'
import type { IKitSize, IRingsKit } from '@/types/ringsKit'
import { api } from './base'
import { proUrl } from './snp'

export const ringApi = api.injectEndpoints({
	endpoints: builder => ({
		// получение типа колец
		getRingSingle: builder.query<{ data: IRing }, null>({
			query: () => `${proUrl}/rings/single`,
		}),
		// получение типов для комплектов
		getRingsKit: builder.query<{ data: IRingsKit }, null>({
			query: () => `${proUrl}/rings/kit`,
		}),

		// получение материалов
		getMaterials: builder.query<{ data: { materials: IRingMaterial[] } }, string>({
			query: type => `${proUrl}/ring-materials/${type}`,
		}),

		// получение модифицирующих добавок
		getModifying: builder.query<{ data: { modifying: IRingModifying[] } }, null>({
			query: () => `${proUrl}/ring-modifying`,
		}),

		// получение размеров для колец
		getSizeSingle: builder.query<{ data: { sizes: IRingSize[] } }, null>({
			query: () => `${proUrl}/ring-sizes/single`,
		}),
		// получение размеров для комплектов
		getSizeKit: builder.query<{ data: { sizes: IKitSize[] } }, string>({
			query: constructionId => ({
				url: `${proUrl}/ring-sizes/kit`,
				method: 'GET',
				params: new URLSearchParams([['constructionId', constructionId]]),
			}),
		}),
	}),
	overrideExisting: false,
})

export const {
	useGetRingSingleQuery,
	useGetRingsKitQuery,
	useGetMaterialsQuery,
	useGetModifyingQuery,
	useGetSizeSingleQuery,
	useGetSizeKitQuery,
} = ringApi

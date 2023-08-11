import type { IRing, IRingMaterial, IRingModifying } from '@/types/rings'
import { api } from './base'
import { proUrl } from './snp'

export const ringApi = api.injectEndpoints({
	endpoints: builder => ({
		// получение типа колец
		getRing: builder.query<{ data: IRing }, null>({
			query: () => `${proUrl}/rings`,
		}),

		// получение материалов
		getMaterials: builder.query<{ data: { materials: IRingMaterial[] } }, string>({
			query: type => `${proUrl}/ring-materials/${type}`,
		}),

		// получение модифицирующих добавок
		getModifying: builder.query<{ data: { modifying: IRingModifying[] } }, null>({
			query: () => `${proUrl}/ring-modifying`,
		}),
	}),
	overrideExisting: false,
})

export const { useGetRingQuery, useGetMaterialsQuery, useGetModifyingQuery } = ringApi

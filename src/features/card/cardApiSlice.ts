import type { ICopyPosition, Position } from './types/card'
import { API } from '@/app/api'
import { apiSlice } from '@/app/apiSlice'

export const cardApiSlice = apiSlice.injectEndpoints({
	overrideExisting: false,
	endpoints: builder => ({
		// добавление позиции
		createPosition: builder.mutation<string, Position>({
			query: position => ({
				url: API.positions.base,
				method: 'POST',
				body: position,
			}),
			invalidatesTags: [{ type: 'Orders', id: 'current' }],
		}),

		// обновление позиции
		updatePosition: builder.mutation<string, Position>({
			query: position => ({
				url: `${API.positions.base}/${position.id}`,
				method: 'PUT',
				body: position,
			}),
			invalidatesTags: [{ type: 'Orders', id: 'current' }],
		}),

		// удаление позиции
		deletePosition: builder.mutation<string, string>({
			query: positionId => ({
				url: `${API.positions.base}/${positionId}`,
				method: 'DELETE',
			}),
			invalidatesTags: [{ type: 'Orders', id: 'current' }],
		}),

		// перенос позиции из прошлой заявки в текущую
		copyPosition: builder.mutation<string, ICopyPosition>({
			query: position => ({
				url: `${API.positions.copy}/${position.id}`,
				method: 'POST',
				body: position,
			}),
			invalidatesTags: [{ type: 'Orders', id: 'current' }],
		}),
	}),
})

export const {
	useCreatePositionMutation,
	useUpdatePositionMutation,
	useDeletePositionMutation,
	useCopyPositionMutation,
} = cardApiSlice

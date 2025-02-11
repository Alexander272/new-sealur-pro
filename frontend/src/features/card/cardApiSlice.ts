import { toast } from 'react-toastify'

import type { ICopyPosition, Position, PositionDTO } from './types/card'
import { API } from '@/app/api'
import { apiSlice } from '@/app/apiSlice'

export const cardApiSlice = apiSlice.injectEndpoints({
	overrideExisting: false,
	endpoints: builder => ({
		getPositionById: builder.query<{ data: Position }, string>({
			query: id => `${API.positions.base}/${id}`,
			providesTags: (_arr, _err, arg) => [{ type: 'Orders', id: 'position_' + arg }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch {
					toast.error('Не удалось получить позицию', { autoClose: false })
				}
			},
		}),

		// добавление позиции
		createPosition: builder.mutation<string, PositionDTO>({
			query: position => ({
				url: API.positions.base,
				method: 'POST',
				body: position,
			}),
			invalidatesTags: [{ type: 'Orders', id: 'current' }],
		}),

		// обновление позиции
		updatePosition: builder.mutation<string, PositionDTO>({
			query: position => ({
				url: `${API.positions.base}/${position.id}`,
				method: 'PUT',
				body: position,
			}),
			invalidatesTags: (_arr, _err, arg) => [{ type: 'Orders', id: 'position_' + arg.id }],
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
	useLazyGetPositionByIdQuery,
	useCreatePositionMutation,
	useUpdatePositionMutation,
	useDeletePositionMutation,
	useCopyPositionMutation,
} = cardApiSlice

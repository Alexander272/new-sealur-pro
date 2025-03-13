import { toast } from 'react-toastify'

import type { IBaseFetchError, IFetchError } from '@/app/types/error'
import type { IDeleteFile, IFile, IUploadFile } from './types/file'
import { API } from '@/app/api'
import { apiSlice } from '@/app/apiSlice'
import { saveAs } from './utils/save'

const filesApiSlice = apiSlice.injectEndpoints({
	overrideExisting: false,
	endpoints: builder => ({
		downloadFile: builder.query<null, Pick<IFile, 'name' | 'group' | 'origName'>>({
			queryFn: async (data, _api, _, baseQuery) => {
				const result = await baseQuery({
					url: API.files,
					params: new URLSearchParams({
						group: data.group,
						name: data.name,
					}),
					cache: 'no-cache',
					responseHandler: response => (response.status === 200 ? response.blob() : response.json()),
				})

				if (result.error) {
					console.log(result.error)
					const fetchError = result.error as IFetchError
					toast.error(fetchError.data.message, { autoClose: false })
				}

				if (result.data instanceof Blob) saveAs(result.data, data.origName)
				return { data: null }
			},
		}),

		uploadFile: builder.mutation<IFile, IUploadFile>({
			query: data => ({
				url: API.files,
				method: 'POST',
				body: data.data,
				validateStatus: response => response.status === 201,
				cache: 'no-cache',
			}),
			// invalidatesTags: (_res, _err, arg) => [
			// 	{ type: 'Files', id: (arg.data.get('name') as string) || 'drawing' },
			// ],
			// onQueryStarted: async (_arg, api) => {
			// 	try {
			// 		await api.queryFulfilled
			// 	} catch (error) {
			// 		console.log(error)
			// 		const fetchError = (error as IBaseFetchError).error
			// 		toast.error(fetchError.data.message, { autoClose: false })
			// 	}
			// },
		}),
		deleteFile: builder.mutation<null, IDeleteFile>({
			query: data => ({
				url: `${API.files}/${data.id}`,
				method: 'DELETE',
				params: new URLSearchParams({
					group: data.group,
					name: data.name,
				}),
			}),
			// invalidatesTags: [{ type: 'Verification', id: 'documents' }],
			onQueryStarted: async (_arg, api) => {
				try {
					await api.queryFulfilled
				} catch (error) {
					console.log(error)
					const fetchError = (error as IBaseFetchError).error
					toast.error(fetchError.data.message, { autoClose: false })
				}
			},
		}),
	}),
})

export const { useDownloadFileQuery, useLazyDownloadFileQuery, useUploadFileMutation, useDeleteFileMutation } =
	filesApiSlice

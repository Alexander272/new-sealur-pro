import { ChangeEvent, FC } from 'react'
import { Box, Button, CircularProgress, Stack } from '@mui/material'
import { toast } from 'react-toastify'

import type { IFetchError } from '@/app/types/error'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { getOrderId } from '@/features/card/cardSlice'
import { useDeleteFileMutation, useUploadFileMutation } from '@/features/files/filesApiSlice'
import { Upload } from '@/features/files/components/Upload/Upload'
import { Download } from '@/features/files/components/Download/Download'
import { getDrawing, setDesignDrawing } from '../../putgSlice'

type Props = {
	disabled?: boolean
}

export const Files: FC<Props> = ({ disabled }) => {
	const drawing = useAppSelector(getDrawing)
	const orderId = useAppSelector(getOrderId)
	const dispatch = useAppDispatch()

	const [upload, { isLoading: isUploading }] = useUploadFileMutation()
	const [remove, { isLoading: isRemoving }] = useDeleteFileMutation()

	const deleteFile = async () => {
		const dto = {
			group: orderId,
			id: drawing?.id || '',
			name: drawing?.origName || '',
		}
		try {
			await remove(dto).unwrap()
			dispatch(setDesignDrawing())
		} catch (error) {
			const fetchError = error as IFetchError
			toast.error(fetchError.data.message, { autoClose: false })
		}
	}

	const uploadFile = async (event: ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files
		if (!files) return

		const formData = new FormData()
		formData.append('drawing', files[0])
		formData.append('group', orderId)
		formData.append('name', files[0].name)

		try {
			const res = await upload({ data: formData }).unwrap()
			dispatch(setDesignDrawing(res))
		} catch (error) {
			const fetchError = error as IFetchError
			toast.error(fetchError.data.message, { autoClose: false })
		}
	}

	if (drawing)
		return (
			<Stack direction={'row'} spacing={1}>
				<Download drawing={drawing} />
				<Button
					onClick={deleteFile}
					disabled={isRemoving}
					variant='outlined'
					color='error'
					fullWidth
					sx={{ height: 38, textTransform: 'inherit', fontSize: '1rem' }}
				>
					{isRemoving ? (
						<CircularProgress color='error' size={20} sx={{ mr: 1 }} />
					) : (
						<Box
							component={'img'}
							width={22}
							display={'flex'}
							justifyContent={'center'}
							alignItems={'center'}
							mr={1}
							src='/image/delete-file.svg'
							alt='delete'
						/>
					)}
					Удалить
				</Button>
			</Stack>
		)
	return (
		<Upload
			name='drawing'
			id='file'
			label={'Прикрепить чертеж'}
			onChange={uploadFile}
			disabled={disabled}
			loading={isUploading}
		/>
	)
}

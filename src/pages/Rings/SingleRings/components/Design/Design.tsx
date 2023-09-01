import { ChangeEvent, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { setDrawing } from '@/store/rings/ring'
import { CreateFile, DeleteFile } from '@/services/file'
import { FileDownload } from '@/components/FileInput/FileDownload'
import { FileInput } from '@/components/FileInput/FileInput'

type Alert = { type: 'create' | 'delete'; open: boolean; message?: string }

export const Design = () => {
	const [alert, setAlert] = useState<Alert>({ type: 'create', open: false })
	const [loading, setLoading] = useState(false)

	const role = useAppSelector(state => state.user.roleCode)
	const orderId = useAppSelector(state => state.card.orderId)

	const drawing = useAppSelector(state => state.ring.drawing)

	const dispatch = useAppDispatch()

	const uploadFile = async (event: ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files
		if (!files) return

		const formData = new FormData()
		formData.append('drawing', files[0])
		formData.append('group', orderId)

		setLoading(true)
		const res = await CreateFile('files/drawings/pro', formData)
		if (res.data) {
			dispatch(setDrawing(res.data))
		}
		if (res.error) {
			if (res.error == 'Слишком большой файл') setAlert({ type: 'create', open: true, message: res.error })
			else setAlert({ type: 'create', open: true })
		}
		setLoading(false)
	}

	const deleteFile = async () => {
		const res = await DeleteFile(`files/drawings/pro/${drawing?.group}/${drawing?.id}/${drawing?.origName}`)
		if (!res.error) {
			dispatch(setDrawing(null))
		}
		if (res.error) {
			setAlert({ type: 'create', open: true })
		}
	}

	return (
		<Box
			display={'flex'}
			mb={2}
			ml={'auto'}
			mr={'auto'}
			flexDirection={'column'}
			alignItems={'center'}
			width={'100%'}
			maxWidth={850}
			padding={'12px 20px'}
			borderRadius={'12px'}
			boxShadow={'0px 0px 4px 0px #2626262b'}
		>
			<Typography mb={1} textAlign={'justify'}>
				Если кольцо не прямоугольного сечения (например, конусное) или с отличающейся от предложенных
				плотностей, прикрепите чертеж.
			</Typography>

			{role == 'user' ? (
				drawing ? (
					<FileDownload text={drawing.origName} link={drawing.link} onDelete={deleteFile} />
				) : (
					<FileInput name='drawing' id='file' label={'Прикрепить чертеж'} onChange={uploadFile} />
				)
			) : null}
		</Box>
	)
}

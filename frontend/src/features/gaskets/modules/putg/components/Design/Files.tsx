import { ChangeEvent, FC } from 'react'

import { useAppSelector } from '@/hooks/redux'
import { getOrderId } from '@/features/card/cardSlice'
import { FileDownload } from '@/components/FileInput/FileDownload'
import { FileInput } from '@/components/FileInput/FileInput'
import { getDrawing } from '../../putgSlice'

type Props = {
	disabled?: boolean
}

export const Files: FC<Props> = ({ disabled }) => {
	const drawing = useAppSelector(getDrawing)
	const orderId = useAppSelector(getOrderId)

	const deleteFile = async () => {
		//TODO
		// const res = await DeleteFile(`files/drawings/pro/${drawing?.group}/${drawing?.id}/${drawing?.origName}`)
		// if (!res.error) {
		// 	dispatch(setDesignDrawing(null))
		// }
		// if (res.error) {
		// 	setAlert({ type: 'create', open: true })
		// }
	}

	const uploadFile = async (event: ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files
		if (!files) return

		const formData = new FormData()
		formData.append('drawing', files[0])
		formData.append('group', orderId)

		//TODO
		// setLoading(true)
		// const res = await CreateFile('files/drawings/pro', formData)
		// if (res.data) {
		// 	dispatch(setDesignDrawing(res.data))
		// }
		// if (res.error) {
		// 	if (res.error == 'Слишком большой файл') setAlert({ type: 'create', open: true, message: res.error })
		// 	else setAlert({ type: 'create', open: true })
		// }
		// setLoading(false)
	}

	if (drawing) return <FileDownload text={drawing.origName} link={drawing.link} onDelete={deleteFile} />
	return <FileInput name='drawing' id='file' label={'Прикрепить чертеж'} onChange={uploadFile} disabled={disabled} />
}

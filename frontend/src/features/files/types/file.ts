export interface IFile {
	id: string
	name: string
	origName: string
	link: string
	group: string
}

export interface IUploadFile {
	data: FormData
}

export interface IDeleteFile {
	id: string
	name: string
	group: string
}

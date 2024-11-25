import { ChangeEvent, FC } from 'react'

import { Field, Icon, IconImage, Input, Label } from './input.style'

type Props = {
	id?: string
	label?: string
	name: string
	onChange?: (event: ChangeEvent<HTMLInputElement>) => void
}

export const FileInput: FC<Props> = ({ name, id, label, onChange }) => {
	return (
		<Field>
			<Input type='file' name={name} id={id} onChange={onChange} />
			<Label htmlFor={id}>
				<Icon>
					<IconImage src='/image/upload-file.svg' width='24' height='22' alt='upload' />
				</Icon>
				{label}
			</Label>
		</Field>
	)
}

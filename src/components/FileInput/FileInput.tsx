import { ChangeEvent, FC } from 'react'
import { Field, Icon, IconImage, Input, Label } from './input.style'

type Props = {
	id?: string
	label?: string
	name: string
	disabled?: boolean
	onChange?: (event: ChangeEvent<HTMLInputElement>) => void
}

export const FileInput: FC<Props> = ({ name, id, label, disabled, onChange }) => {
	const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
		if (disabled) return
		onChange && onChange(event)
	}

	return (
		<Field>
			<Input type='file' name={name} id={id} onChange={changeHandler} disabled={disabled} />
			<Label htmlFor={id} disabled={disabled}>
				<Icon>
					<IconImage src='/image/upload-file.svg' width='24' height='22' alt='upload' />
				</Icon>
				{label}
			</Label>
		</Field>
	)
}

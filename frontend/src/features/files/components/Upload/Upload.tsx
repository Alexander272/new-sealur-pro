import { ChangeEvent, FC } from 'react'

import { Field, Icon, IconImage, Input, Label } from './input.style'
import { CircularProgress } from '@mui/material'

type Props = {
	id?: string
	label?: string
	name: string
	disabled?: boolean
	loading?: boolean
	onChange?: (event: ChangeEvent<HTMLInputElement>) => void
}

export const Upload: FC<Props> = ({ name, id, label, disabled, loading, onChange }) => {
	const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
		if (disabled) return
		if (onChange) onChange(event)
	}

	return (
		<Field>
			<Input type='file' name={name} id={id} onChange={changeHandler} disabled={disabled || loading} />
			<Label htmlFor={id} disabled={disabled}>
				<Icon>
					{loading ? (
						<CircularProgress size={20} />
					) : (
						<IconImage src='/image/upload-file.svg' width='24' height='22' alt='upload' />
					)}
				</Icon>
				{label}
			</Label>
		</Field>
	)
}

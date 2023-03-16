import { FC, MouseEvent } from 'react'
import { Danger, Field, Icon, IconImage, Link } from './input.style'

type Props = {
	text: string
	// name: string
	link?: string
	// onSave?: (event: MouseEvent<HTMLInputElement>) => void
	onDelete?: (event: MouseEvent<HTMLInputElement>) => void
}

export const FileDownload: FC<Props> = ({ text, link, onDelete }) => {
	return (
		<Field>
			{/* <p className={`${classes.label} ${classes[rounded || "rounded"]}`} onClick={onSave}>
                <span className={classes.icon}>
                    <img src='/image/download-file.svg' alt='upload' />
                </span>
                {text}
            </p> */}
			<Link href={link} download={text}>
				<Icon>
					<IconImage src='/image/download-file.svg' alt='upload' />
				</Icon>
				{text}
			</Link>
			<Danger onClick={onDelete}>
				<Icon>
					<IconImage src='/image/delete-file.svg' alt='delete' />
				</Icon>
				Удалить
			</Danger>
		</Field>
	)
}

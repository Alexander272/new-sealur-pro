import { forwardRef, MouseEvent } from 'react'
import { ForwardRefComponent } from 'framer-motion'

import { Danger, Field, Icon, IconImage, Link } from './input.style'

type Props = {
	text: string
	// name: string
	link?: string
	// onSave?: (event: MouseEvent<HTMLInputElement>) => void
	onDelete?: (event: MouseEvent<HTMLInputElement>) => void
}

export const FileDownload: ForwardRefComponent<HTMLAnchorElement, Props> = forwardRef(
	({ text, link, onDelete }, ref) => {
		return (
			<Field>
				{/* <p className={`${classes.label} ${classes[rounded || "rounded"]}`} onClick={onSave}>
                <span className={classes.icon}>
                    <img src='/image/download-file.svg' alt='upload' />
                </span>
                {text}
            </p> */}
				<Link ref={ref} href={link} download={text}>
					<Icon>
						<IconImage src='/image/download-file.svg' alt='download' />
					</Icon>
					{text}
				</Link>
				{onDelete && (
					<Danger onClick={onDelete}>
						<Icon>
							<IconImage src='/image/delete-file.svg' alt='delete' />
						</Icon>
						Удалить
					</Danger>
				)}
			</Field>
		)
	}
)

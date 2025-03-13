import { FC, MouseEvent } from 'react'

import { Danger, Field, Icon, IconImage, Link } from './input.style'

type Props = {
	text: string
	link?: string
	onDelete?: (event: MouseEvent<HTMLInputElement>) => void
}

export const FileDownload: FC<Props> = ({ text, link, onDelete }) => {
	return (
		<Field>
			<Link href={link} download={text}>
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

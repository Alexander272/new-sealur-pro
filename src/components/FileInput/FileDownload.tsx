import React, { FC } from "react"
import classes from "./input.module.scss"

type Props = {
    text: string
    name: string
    rounded?: "round" | "rounded"
    link?: string
    onSave?: (event: React.MouseEvent<HTMLInputElement>) => void
    onDelete?: (event: React.MouseEvent<HTMLInputElement>) => void
}

export const FileDownload: FC<Props> = ({ text, rounded = "rounded", link, onSave, onDelete }) => {
    return (
        <div className={classes.field}>
            {/* <p className={`${classes.label} ${classes[rounded || "rounded"]}`} onClick={onSave}>
                <span className={classes.icon}>
                    <img src='/image/download-file.svg' alt='upload' />
                </span>
                {text}
            </p> */}
            <a href={link} download={text} className={`${classes.label} ${classes[rounded]}`}>
                <span className={classes.icon}>
                    <img src='/image/download-file.svg' alt='upload' />
                </span>
                {text}
            </a>
            <p
                className={`${classes.label} ${classes.danger} ${classes[rounded]}`}
                onClick={onDelete}
            >
                <span className={classes.icon}>
                    <img src='/image/delete-file.svg' alt='delete' />
                </span>
                Удалить
            </p>
        </div>
    )
}

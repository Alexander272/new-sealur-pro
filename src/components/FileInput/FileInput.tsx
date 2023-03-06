import React, { FC } from "react"
import classes from "./input.module.scss"

type Props = {
    id?: string
    label?: string
    name: string
    rounded?: "round" | "rounded"
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const FileInput: FC<Props> = ({ name, id, label, rounded = "rounded", onChange }) => {
    return (
        <div className={classes.field}>
            <input type='file' name={name} id={id} className={classes.input} onChange={onChange} />
            <label htmlFor={id} className={`${classes.label} ${classes[rounded]}`}>
                <span className={classes.icon}>
                    <img src='/image/upload-file.svg' width='24' height='22' alt='upload' />
                </span>
                {label}
            </label>
        </div>
    )
}

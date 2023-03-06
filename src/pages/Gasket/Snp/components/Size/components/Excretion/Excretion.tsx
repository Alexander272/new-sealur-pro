import { FC } from "react"
import classes from "./excretion.module.scss"

type Props = {
    typePr: string
    isOpenFr: boolean
    isOpenIr: boolean
    isOpenOr: boolean
}

export const Excretion: FC<Props> = ({ typePr, isOpenFr, isOpenIr, isOpenOr }) => {
    const createExcretion = (type: string, pos: string) => {
        let cl = type + pos
        if (typePr === "Д" || typePr === "Г") {
            return <div className={`${classes.type_e} ${classes[cl]}`}></div>
        } else {
            return <div className={`${classes.type_a} ${classes[cl]}`}></div>
        }
    }

    return (
        <>
            {isOpenIr && (
                <>
                    {createExcretion("ir", "Left")}
                    {createExcretion("ir", "Right")}
                </>
            )}
            {isOpenOr && (
                <>
                    {createExcretion("or", "Left")}
                    {createExcretion("or", "Right")}
                </>
            )}
            {isOpenFr && (
                <>
                    {createExcretion("fr", "Left")}
                    {createExcretion("fr", "Right")}
                </>
            )}
        </>
    )
}

import { FC } from "react"
import classes from "./sizes.module.scss"

type Props = {
    typePr: string
    h: string
    oh: string
    s2: string
    s3: string
    st: string

    d1: string
    d2: string
    d3: string
    d4: string
}

const type = {
    Д: "type_d",
    Г: "type_g",
    В: "type_v",
    Б: "type_b",
    А: "type_a",
}

export const Sizes: FC<Props> = ({ typePr, h, oh, s2, s3, st, d1, d2, d3, d4 }) => {
    return (
        <>
            <p className={`${classes.sizes} ${classes[type[typePr as "Д"]]} ${classes.h}`}>
                {h !== "др." ? h : oh}
            </p>
            <p className={`${classes.sizes} ${classes[type[typePr as "Д"]]} ${classes.s2}`}>{s2}</p>
            <p className={`${classes.sizes} ${classes[type[typePr as "Д"]]} ${classes.s3}`}>{s3}</p>
            <p className={`${classes.sizes} ${classes[type[typePr as "Д"]]} ${classes.d1}`}>
                {d1 === "0" ? "-" : d1} <span className={classes.d}>(D1)</span>
            </p>
            <p className={`${classes.sizes} ${classes[type[typePr as "Д"]]} ${classes.d2}`}>
                {d2}{" "}
                <span className={`${classes.d} ${["1", "2"].includes(st) ? classes.d_active : ""}`}>
                    (D2)
                </span>
            </p>
            <p className={`${classes.sizes} ${classes[type[typePr as "Д"]]} ${classes.d3}`}>
                {d3} <span className={classes.d}>(D3)</span>
            </p>
            <p className={`${classes.sizes} ${classes[type[typePr as "Д"]]} ${classes.d4}`}>
                {d4 === "0" ? "-" : d4} <span className={classes.d}>(D4)</span>
            </p>
        </>
    )
}

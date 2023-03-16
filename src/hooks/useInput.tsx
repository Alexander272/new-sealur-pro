import { ChangeEvent, useState } from 'react'

type Props = {
	validation?: 'email' | 'uint' | 'inn' | 'empty'
}

export const useInput = (props?: Props) => {
	const [value, setValue] = useState('')
	//TODO надо подумать как сделать нормальную валидацию
	const [valid, setValid] = useState(true)

	const onChange = (event: ChangeEvent<HTMLInputElement>) => {
		let newValue = event.target.value
		let isValid = true
		// let regex: RegExp = /^/

		if (props?.validation === 'email') {
			const regex =
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			if (event.target.value === '' || regex.test(event.target.value)) {
				isValid = true
			} else isValid = false
		}
		if (props?.validation === 'inn') {
			const regex = /^[\d+]{10,12}$/
			if (event.target.value === '' || regex.test(event.target.value)) {
				isValid = true
			} else isValid = false
		}

		// if (event.target.value === '' || regex.test(event.target.value)) {
		// 	isValid = true
		// } else isValid = false

		setValid(isValid)
		setValue(newValue)

		// console.log(isValid)
	}

	return { value, onChange, valid }
}

import { ChangeEvent, useState } from 'react'

type Props = {
	validation?: 'email' | 'uint' | 'inn' | 'empty' | 'phone' | 'password'
	replace?: 'phone'
}

const maskPhone = '+7 (###) ###-##-## (доб. ###)'

export const useInput = (props?: Props) => {
	const [value, setValue] = useState('')
	// надо подумать как сделать нормальную валидацию
	const [valid, setValid] = useState(true)

	const onChange = (event: ChangeEvent<HTMLInputElement>) => {
		let newValue = event.target.value

		// let regex: RegExp = /^/

		if (props?.replace === 'phone') {
			let parts = newValue.split('')
			let phone = maskPhone.split('')
			const regex = /[0-9]/
			newValue = ''

			if (parts[0] == '8' && parts.length > 1) parts.splice(0, 1)

			for (let i = 0; i < parts.length; i++) {
				if (i == phone.length) break
				const p = parts[i]

				if (phone[i] == '#') {
					if (regex.test(p)) {
						newValue += p
						continue
					}
				}

				if (p === phone[i]) newValue += p
				else {
					newValue += phone[i]
					parts.splice(i, 0, phone[i])
				}
			}
		}

		// if (event.target.value === '' || regex.test(event.target.value)) {
		// 	isValid = true
		// } else isValid = false

		setValue(newValue)

		// console.log(isValid)
	}

	const validate = () => {
		let isValid = true

		if (props?.validation === 'email') {
			const regex =
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			if (regex.test(value)) {
				isValid = true
			} else isValid = false
		}
		if (props?.validation === 'password') {
			const regex = /(?=.*[0-9])(?=.*[a-zа-я])(?=.*[A-ZА-Я])[0-9a-zA-Zа-яА-Я]{6,20}/g
			if (regex.test(value)) {
				isValid = true
			} else isValid = false
		}
		if (props?.validation === 'inn') {
			const regex = /^[\d+]{10,12}$/
			if (regex.test(value)) {
				isValid = true
			} else isValid = false
		}
		if (props?.validation === 'empty') {
			if (value.trim() === '') isValid = false
			else isValid = true
		}

		setValid(isValid)
		return isValid
	}

	return { value, onChange, valid, validate }
}

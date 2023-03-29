import { ChangeEvent, useState } from 'react'

type Props = {
	validation?: 'email' | 'uint' | 'inn' | 'empty' | 'phone'
	replace?: 'phone'
}

const maskPhone = '+7 (###) ###-##-## (доб. ###)'

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

		if (props?.replace === 'phone') {
			let parts = newValue.split('')
			let phone = maskPhone.split('')
			const regex = /[0-9]/
			newValue = ''

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

			// let idx = 0
			// for (let i = 0; i < phone.length; i++) {
			// 	const p = phone[i]

			// 	if (idx == parts.length) break

			// 	if (p === '#') {
			// 		if (idx == 0 && parts[idx] == '8') idx++

			// 		if (regex.test(parts[idx])) {
			// 			newValue += parts[idx]
			// 		}
			// 		idx++
			// 		// regex.test(parts[i])
			// 	} else {
			// 		newValue += p
			// 	}
			// }

			// parts.forEach((p, i) => {
			// 	if (p == phone[idx] || phone[idx] === '#') {
			// 		if (phone[idx] === '#' && !regex.test(p)) return
			// 		newValue += p
			// 		idx++
			// 	} else {
			// 	}
			// })

			// if (parts[0] != '+' && parts[0] != '8') {
			// 	newValue = '+7 ('
			// 	parts.forEach((p, i) => {})
			// }

			// if (event.target.value === '8') newValue = '+7'
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

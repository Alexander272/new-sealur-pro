import { ChangeEvent, useEffect, useState } from 'react'

type Props = {
	value?: string
	validation?: 'email' | 'uint' | 'inn' | 'empty' | 'phone' | 'password'
	replace?: 'phone'
}

// const maskPhone = '+7 (###) ###-##-## (доб. ###)'

export const useInput = (props?: Props) => {
	const [value, setValue] = useState(props?.value || '')
	// надо подумать как сделать нормальную валидацию
	const [valid, setValid] = useState(true)

	useEffect(() => {
		if (props?.value) setValue(props.value)
	}, [props?.value])

	const onChange = (event: ChangeEvent<HTMLInputElement>) => {
		let newValue = event.target.value

		if (props?.replace === 'phone') {
			// if (newValue.length == 1) {
			// 	newValue = '7' + newValue
			// }
			newValue = newValue.replace(/[^0-9]/g, '')
			if (newValue[0] != '7' && (newValue.length < 10 || (newValue.length > 11 && newValue.length < 14))) {
				newValue = '7' + newValue
			}

			newValue = newValue.substring(1)

			let template = '+7 (###) ###-##-## (доб. ###)'
			newValue.split('').forEach(v => {
				const idx = template.indexOf('#')
				const parts = template.split('')
				parts[idx] = v
				template = parts.join('')
			})

			let idx = template.indexOf('#')

			if (newValue.length === 10) {
				template = template.substring(0, idx - 1)
				idx = template.lastIndexOf(' ')
			}

			if (idx != -1) {
				newValue = template.substring(0, idx)
			} else {
				newValue = template
			}

			// let pattern = /(\+7|8)[\s(]?(\d{3})[\s)]?(\d{3})[\s-]?(\d{2})[\s-]?(\d{2})/g
			// newValue = newValue.replace(pattern, '+7 ($2) $3-$4-$5')

			// newValue = newValue.replace(/^(\d{3})(\d{3})(\d{2})(\d{2})$/, '+7 ($1) $2-$3-$4')

			// let parts = newValue.split('')
			// let phone = maskPhone.split('')
			// const regex = /[0-9]/
			// newValue = ''

			// if (parts[0] == '8' && parts.length > 1) parts.splice(0, 1)

			// if (newValue.length < 5) {
			// 	newValue = newValue.replace(/^(\d{3})$/, '+7 ($1)')
			// } else {
			// 	newValue = newValue.replace(/^(\d{3})(\d{3})(\d{2})(\d{2})$/, '+7 ($1) $2-$3-$4')
			// }

			// for (let i = 0; i < parts.length; i++) {
			// 	if (i == phone.length) break
			// 	const p = parts[i]

			// 	if (phone[i] == '#') {
			// 		if (regex.test(p)) {
			// 			newValue += p
			// 			continue
			// 		}
			// 	}

			// 	if (p === phone[i]) newValue += p
			// 	else {
			// 		newValue += phone[i]
			// 		parts.splice(i, 0, phone[i])
			// 	}
			// }

			// let matrix = '+7 (___) ___-__-__ (доб. ___)'
			// 	i = 0,
			// 	def = matrix.replace(/\D/g, ''),
			// 	val = newValue.replace(/\D/g, ''),
			// 	new_value = matrix.replace(/[_\d]/g, function (a) {
			// 		return i < val.length ? val.charAt(i++) || def.charAt(i) : a
			// 	})
			// i = new_value.indexOf('_')
			// if (i != -1) {
			// 	i < 5 && (i = 3)
			// 	new_value = new_value.slice(0, i)
			// }
			// let reg = matrix
			// 	.substring(0, newValue.length)
			// 	.replace(/_+/g, function (a) {
			// 		return '\\d{1,' + a.length + '}'
			// 	})
			// 	.replace(/[+()]/g, '\\$&')
			// const regex = new RegExp('^' + reg + '$')
			// if (!regex.test(newValue) || newValue.length < 5) newValue = new_value
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
			const regex = /(?=.*[0-9])(?=.*[a-zа-я])(?=.*[A-ZА-Я])[0-9a-zA-Zа-яА-Я.,!@#$%^&?!*]{6,20}/g
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

	const clear = () => setValue('')

	return { value, onChange, valid, validate, clear }
}

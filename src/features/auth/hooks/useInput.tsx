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
		let v = event.target.value

		if (props?.replace === 'phone') {
			v = v.replace(/\D/g, '')
			if (v[0] == '8') v = v.replace(/^(8)/, '7')

			if (v[0] != '7') v = v.replace(/^(\d)/g, '+7 ($1')
			else v = v.replace(/^(\d)/g, '+$1')
			v = v.replace(/^(\+7)(\d{3})(\d{3})(\d{2})(\d{2})(\d{1,})/, '$1 ($2) $3-$4-$5 (доб. $6)')
			v = v.replace(/^(\+7)(\d{3})(\d{3})(\d{2})(\d)/, '$1 ($2) $3-$4-$5')
			v = v.replace(/^(\+7)(\d{3})(\d{3})(\d)/, '$1 ($2) $3-$4')
			v = v.replace(/^(\+7)(\d{3})(\d)/, '$1 ($2) $3')
			v = v.replace(/^(\+7)(\d)/, '$1 ($2')

			// v = v.replace(/^(\+7)(\d)/, '$1 ($2')
			// v = v.replace(/^(\+7) (\(\d{3})(\d)/, '$1 $2) $3')
			// v = v.replace(/^(\+7) (\(\d{3}\)) (\d{3})(\d)/, '$1 $2 $3-$4')
			// v = v.replace(/^(\+7) (\(\d{3}\)) (\d{3})-(\d{2})(\d)/, '$1 $2 $3-$4-$5')
			// v = v.replace(/^(\+7) (\(\d{3}\)) (\d{3})-(\d{2})-(\d{2})(\d{1,})/, '$1 $2 $3-$4-$5 (доб. $6)')

			// newValue = newValue.replace(/[^0-9]/g, '')
			// if (newValue[0] != '7' && (newValue.length < 10 || (newValue.length > 11 && newValue.length < 14))) {
			// 	newValue = '7' + newValue
			// }

			// newValue = newValue.substring(1)

			// let template = '+7 (###) ###-##-## (доб. ###)'
			// newValue.split('').forEach(v => {
			// 	const idx = template.indexOf('#')
			// 	const parts = template.split('')
			// 	parts[idx] = v
			// 	template = parts.join('')
			// })

			// let idx = template.indexOf('#')

			// if (newValue.length === 10) {
			// 	template = template.substring(0, idx - 1)
			// 	idx = template.lastIndexOf(' ')
			// }

			// if (idx != -1) {
			// 	newValue = template.substring(0, idx)
			// } else {
			// 	newValue = template
			// }

			// ^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}( \(доб\. \d{1,}\))?$
		}
		setValue(v)
	}

	const validate = () => {
		let isValid = true

		if (props?.validation === 'email') {
			const regex =
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			isValid = regex.test(value)
		}
		if (props?.validation === 'password') {
			const regex = /(?=.*[0-9])(?=.*[a-zа-я])(?=.*[A-ZА-Я])[0-9a-zA-Zа-яА-Я.,!@#$%^&?!*]{6,20}/g
			isValid = regex.test(value)
		}
		if (props?.validation === 'inn') {
			const regex = /^[\d+]{10,12}$/
			isValid = regex.test(value)
		}
		if (props?.validation === 'empty') {
			if (value.trim() === '') isValid = false
			else isValid = true
		}
		if (props?.validation === 'phone') {
			const regex = /(^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}( \(доб\. \d{1,}\))?)?$/
			isValid = regex.test(value)
		}

		setValid(isValid)
		return isValid
	}

	const clear = () => setValue('')

	return { value, onChange, valid, validate, clear }
}

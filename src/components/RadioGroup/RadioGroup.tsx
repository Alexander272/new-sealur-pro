import { Children, cloneElement, FC, MouseEvent, PropsWithChildren, useEffect, useRef, useState } from 'react'
import { ActiveItem, Group, Item } from './group.style'

type Props = {
	onChange: (value: string) => void
	disabled?: boolean
}

export const RadioGroup: FC<PropsWithChildren<Props>> = ({ children, onChange, disabled }) => {
	const [substrate, setSubstrate] = useState({ width: 0, position: 0 })
	const groupRef = useRef<HTMLDivElement | null>(null)

	const selectHandler = (event: MouseEvent<HTMLDivElement>) => {
		if (disabled) return

		const element = event.target as HTMLDivElement

		const value = element.dataset.value
		if (!value) return

		setSubstrate({
			width: element.offsetWidth,
			position: element.offsetLeft,
		})

		onChange(value)
	}

	useEffect(() => {
		groupRef.current?.childNodes.forEach(c => {
			if ((c as any).dataset.active == 'true') {
				setSubstrate({
					width: (c as HTMLAnchorElement).offsetWidth,
					position: (c as HTMLAnchorElement).offsetLeft,
				})
			}
		})
	}, [children])

	return (
		<Group ref={groupRef} onClick={selectHandler}>
			<ActiveItem width={substrate.width} left={substrate.position} />
			{children}
		</Group>
	)
}

type ItemProps = {
	active?: boolean
	disabled?: boolean
	value: string
}

export const RadioItem: FC<PropsWithChildren<ItemProps>> = ({ children, active, value, disabled }) => {
	return (
		<Item data-active={active} data-value={value} active={active} disabled={disabled}>
			{children}
		</Item>
	)
}

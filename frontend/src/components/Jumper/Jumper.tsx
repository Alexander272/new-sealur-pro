import { FC, MouseEvent, useState } from 'react'
import { Dialog, DialogContent, DialogTitle, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { Image } from '@/features/gaskets/components/Skeletons/gasket.style'
import { IMainJumper } from './type'
import { Field } from './jumper.style'

import A from '@/assets/jumper/a.webp'
import B from '@/assets/jumper/b.webp'
import C from '@/assets/jumper/c.webp'
import D from '@/assets/jumper/d.webp'
import E from '@/assets/jumper/e.webp'
import F from '@/assets/jumper/f.webp'
import G from '@/assets/jumper/g.webp'
import H from '@/assets/jumper/h.webp'
import I from '@/assets/jumper/i.webp'
import J from '@/assets/jumper/j.webp'
import K from '@/assets/jumper/k.webp'
import L from '@/assets/jumper/l.webp'
import M from '@/assets/jumper/m.webp'
import N from '@/assets/jumper/n.webp'
import O from '@/assets/jumper/o.webp'
import P from '@/assets/jumper/p.webp'
import Q from '@/assets/jumper/q.webp'
import R from '@/assets/jumper/r.webp'
import S from '@/assets/jumper/s.webp'
import T from '@/assets/jumper/t.webp'
import U from '@/assets/jumper/u.webp'
import V from '@/assets/jumper/v.webp'
import W from '@/assets/jumper/w.webp'
import X from '@/assets/jumper/x.webp'

const jumperVariants: IMainJumper[] = [
	{ id: '1', code: 'A', hasDrawing: false, imageUrl: A },
	{ id: '2', code: 'B', hasDrawing: true, imageUrl: B },
	{ id: '3', code: 'C', hasDrawing: true, imageUrl: C },
	{ id: '4', code: 'D', hasDrawing: true, imageUrl: D },
	{ id: '5', code: 'E', hasDrawing: true, imageUrl: E },
	{ id: '6', code: 'F', hasDrawing: true, imageUrl: F },
	{ id: '7', code: 'G', hasDrawing: true, imageUrl: G },
	{ id: '8', code: 'H', hasDrawing: true, imageUrl: H },
	{ id: '9', code: 'I', hasDrawing: true, imageUrl: I },
	{ id: '10', code: 'J', hasDrawing: false, imageUrl: J },
	{ id: '11', code: 'K', hasDrawing: true, imageUrl: K },
	{ id: '12', code: 'L', hasDrawing: true, imageUrl: L },
	{ id: '13', code: 'M', hasDrawing: false, imageUrl: M },
	{ id: '14', code: 'N', hasDrawing: true, imageUrl: N },
	{ id: '15', code: 'O', hasDrawing: true, imageUrl: O },
	{ id: '16', code: 'P', hasDrawing: true, imageUrl: P },
	{ id: '17', code: 'Q', hasDrawing: true, imageUrl: Q },
	{ id: '18', code: 'R', hasDrawing: true, imageUrl: R },
	{ id: '19', code: 'S', hasDrawing: true, imageUrl: S },
	{ id: '20', code: 'T', hasDrawing: true, imageUrl: T },
	{ id: '21', code: 'U', hasDrawing: true, imageUrl: U },
	{ id: '22', code: 'V', hasDrawing: true, imageUrl: V },
	{ id: '23', code: 'W', hasDrawing: true, imageUrl: W },
	{ id: '24', code: 'X', hasDrawing: true, imageUrl: X },
]

type Props = {
	value: string
	onSelect: (jumper: IMainJumper) => void
}

export const JumperSelect: FC<Props> = ({ value, onSelect }) => {
	const [open, setOpen] = useState(false)

	const toggleHandler = () => {
		setOpen(prev => !prev)
	}

	const jumperHandler = (event: MouseEvent<HTMLDivElement>) => {
		const { select } = (event.target as HTMLDivElement).dataset

		const jumper = jumperVariants.find(j => j.code === select)
		if (!jumper) return

		onSelect(jumper)
		toggleHandler()
	}

	return (
		<>
			<Dialog open={open} onClose={toggleHandler}>
				<DialogTitle>Выберите тип конфигурации перемычек</DialogTitle>
				<DialogContent dividers>
					<List dense>
						{jumperVariants.map(j => (
							<ListItemButton
								key={j.id}
								selected={value === j.code}
								data-select={j.code}
								onClick={jumperHandler}
								sx={{ borderRadius: '12px' }}
							>
								<ListItemText primary={j.code} sx={{ pointerEvents: 'none' }} />
								<ListItemIcon sx={{ pointerEvents: 'none' }}>
									<Image src={j.imageUrl} alt={j.code} />
								</ListItemIcon>
							</ListItemButton>
						))}
					</List>
				</DialogContent>
			</Dialog>
			<Field onClick={toggleHandler}>{value}</Field>
		</>
	)
}

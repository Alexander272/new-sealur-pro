import { Button, IconButton, Typography } from '@mui/material'
import { FC, MouseEvent, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { CardContainer, CircleButton, Container, Item, Position, Positions } from './card.style'
import { setSnp } from '@/store/gaskets/snp'
import { deletePosition, toggle } from '@/store/card'

type Props = {}

export const Card: FC<Props> = () => {
	// const [open, setOpen] = useState(false)
	const open = useAppSelector(state => state.card.open)
	const positions = useAppSelector(state => state.card.positions)
	const snpCardIndex = useAppSelector(state => state.snp.cardIndex)

	const dispatch = useAppDispatch()

	const toggleHandler = () => {
		dispatch(toggle())
	}

	const selectHandler = (event: MouseEvent<HTMLDivElement>) => {
		const { index, id } = (event.target as HTMLDivElement).dataset
		if (index === undefined && id === undefined) return

		if (index != undefined) saveHandler(+index)
		if (id) deleteHandler(id)
	}

	const deleteHandler = (id: string) => {
		dispatch(deletePosition(id))
	}

	const saveHandler = (index: number) => {
		const position = positions[index]
		if (position.type === 'Snp') {
			const snp = {
				cardIndex: index,
				main: position.main,
				sizes: position.sizes,
				materials: position.materials,
				design: position.design,
				amount: position.amount,
			}

			dispatch(setSnp(snp))
		}
	}

	return (
		<Container open={open}>
			<CardContainer open={open}>
				{open && (
					<>
						<Typography variant='h5' sx={{ marginBottom: 1 }}>
							Заявка
						</Typography>

						<Positions onClick={selectHandler}>
							{positions.map((p, idx) => (
								<Item key={p.id}>
									<Position data-index={idx} active={snpCardIndex == idx}>
										<Typography
											component='span'
											sx={{ pointerEvents: 'none', fontWeight: 'inherit' }}
										>
											{p.count}.
										</Typography>{' '}
										<Typography
											component='span'
											sx={{ pointerEvents: 'none', fontWeight: 'inherit' }}
										>
											{p.title}
										</Typography>{' '}
										-{' '}
										<Typography
											component='span'
											sx={{ pointerEvents: 'none', fontWeight: 'inherit' }}
										>
											{p.amount} шт.
										</Typography>
									</Position>
									<IconButton
										data-id={p.id}
										sx={{
											lineHeight: '14px',
											position: 'absolute',
											right: '0px',
											top: '50%',
											transform: 'translateY(-50%)',
										}}
									>
										&times;
									</IconButton>
								</Item>
							))}
						</Positions>

						<CircleButton onClick={toggleHandler} open={open}>
							{/* ➔ */}➜
						</CircleButton>

						{positions.length && (
							<Button variant='contained' sx={{ borderRadius: '12px', marginTop: 'auto' }}>
								Отправить заявку
							</Button>
						)}
					</>
				)}
			</CardContainer>

			{!open && (
				<CircleButton onClick={toggleHandler} open={open}>
					➔
				</CircleButton>
			)}
		</Container>
	)
}

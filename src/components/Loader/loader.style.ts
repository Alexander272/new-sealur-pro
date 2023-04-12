import styled, { keyframes } from 'styled-components'

type LoaderProps = {
	background: 'none' | 'fill'
	isFull?: boolean
}
export const Container = styled.div<LoaderProps>`
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	z-index: 80;
	background-color: ${props => (props.background == 'none' ? 'transparent' : '#eaeefc40')};
`

const animate = keyframes`
    50% {
        width: var(--animateSize);
        height: var(--animateSize);
        transform: rotate(180deg);
    }

    100% {
        transform: rotate(360deg);
    }
`

export const Spinner = styled.div`
	--offsetSize: 20px;
	--size: 40px;
	--animateSize: 60px;

	position: relative;
	z-index: 25;
	color: var(--primary-color);
	width: var(--size);
	height: var(--size);

	background: conic-gradient(
			from -45deg at top var(--offsetSize) left 50%,
			#0000,
			currentColor 1deg 90deg,
			#0000 91deg
		),
		conic-gradient(from 45deg at right var(--offsetSize) top 50%, #0000, currentColor 1deg 90deg, #0000 91deg),
		conic-gradient(from 135deg at bottom var(--offsetSize) left 50%, #0000, currentColor 1deg 90deg, #0000 91deg),
		conic-gradient(from -135deg at left var(--offsetSize) top 50%, #0000, currentColor 1deg 90deg, #0000 91deg);
	animation: ${animate} 2s infinite cubic-bezier(0.3, 1, 0, 1);
`

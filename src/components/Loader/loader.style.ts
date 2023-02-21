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

	//     &.none {
	//         background-color: transparent;
	//     }

	//     &.fill {
	//         background-color: #eaeefc70;
	//         // background-color: #36363647;
	//     }

	//     &.full {
	//         width: 1580px;
	//         position: relative;
	//     }
	// }
`

// @media (max-width: 1600px) {
//     .container.full {
//         grid-column-start: 1;
//         grid-column-end: 13;
//         width: 100%;
//     }
// }

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
	color: hsl(var(--secondary-hue) 92% 26%);
	width: var(--size);
	height: var(--size);

	//     &.small {
	//         --offsetSize: 10px;
	//         --size: 20px;
	//         --animateSize: 30px;
	//     }

	//     &.large {
	//         --offsetSize: 30px;
	//         --size: 60px;
	//         --animateSize: 90px;
	//     }

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

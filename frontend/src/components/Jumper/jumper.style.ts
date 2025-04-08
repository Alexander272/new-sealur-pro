import styled from '@emotion/styled'

export const Field = styled.div`
	border-radius: 12px;
	padding: 7px 14px;
	border: 1px solid rgba(0, 0, 0, 0.23);
	cursor: pointer;
	transition: all 0.3s ease-in-out;

	&:hover {
		border-color: rgba(0, 0, 0, 0.87);
	}

	&:focus,
	&:active {
		border-color: var(--primary-color);
	}
`

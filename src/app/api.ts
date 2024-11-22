export const API = Object.freeze({
	auth: {
		signIn: `auth/sign-in` as const,
		signUp: `auth/sign-up` as const,
		refresh: `auth/refresh` as const,
		signOut: `auth/sign-out` as const,
	},
	users: {
		base: 'users' as const,
		confirm: 'users/confirm' as const,
		recovery: 'users/recovery' as const,
	},
})

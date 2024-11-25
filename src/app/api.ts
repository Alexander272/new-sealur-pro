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
	feedback: 'connect/feedback' as const,
	analytics: {
		base: 'analytics' as const,
		users: 'analytics/users' as const,
		orders: 'analytics/orders' as const,
	},
	orders: {
		base: 'orders' as const,
		last: 'orders/last' as const,
		number: 'orders/number' as const,
		count: 'orders/count' as const,
	},
	snp: {
		base: 'snp' as const,
		data: 'snp/data' as const,
		info: 'snp/info' as const,
		standards: 'snp-standards' as const,
		flangeTypes: 'snp/flange-types' as const,
		fillers: 'snp/fillers' as const,
		materials: 'snp/materials' as const,
	},
})

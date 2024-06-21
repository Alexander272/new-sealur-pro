export const AppRoutes = Object.freeze({
	Home: '/',
	Auth: {
		Base: '/auth',
		Confirm: '/auth/confirm',
		Recovery: '/auth/recovery',
	},
	Connect: '/connect',
	Gasket: {
		Base: '/gaskets',
		SNP: '/gaskets/snp',
		PUTG: '/gaskets/putg',
	},
	Ring: {
		Base: '/rings',
		Single: '/rings/single',
		Kit: '/rings/kit',
	},
	Order: '/orders',
	Manager: {
		Base: '/manager',
		Orders: '/manager/orders',
		Analytics: {
			Base: '/manager/analytics',
			Users: '/manager/analytics/users',
			Orders: '/manager/analytics/orders',
			Count: '/manager/analytics/count',
			User: '/manager/analytics/user',
		},
	},
})

export const PathRoutes = Object.freeze({
	Home: '/',
	Auth: {
		Base: '/auth',
		Confirm: '/auth/confirm',
		Recovery: '/auth/recovery',
		RecoveryCode: '/auth/recovery/:code',
	},
	Connect: '/connect',
	Gasket: {
		Base: '/gaskets',
		SNP: '/gaskets/snp',
		PUTG: '/gaskets/putg',
	},
	Rings: {
		Base: '/rings',
		Single: '/rings/single',
		Kit: '/rings/kit',
	},
	Orders: '/orders',
	Manager: {
		Base: '/manager',
		Orders: {
			Base: '/manager/orders',
			Order: '/manager/orders/:id',
			Last: '/manager/orders/last',
		},
		Analytics: {
			Base: '/manager/analytics',
			Users: '/manager/analytics/users',
			Orders: '/manager/analytics/orders',
			Count: '/manager/analytics/count',
			User: '/manager/analytics/user',
		},
	},
})

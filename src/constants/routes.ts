export const PathRoutes = Object.freeze({
	Home: '/' as const,
	Auth: {
		Base: '/auth' as const,
		Confirm: '/auth/confirm' as const,
		Recovery: '/auth/recovery' as const,
		RecoveryCode: '/auth/recovery/:code' as const,
	},
	Connect: '/connect' as const,
	Gasket: {
		Base: '/gaskets' as const,
		SNP: '/gaskets/snp' as const,
		PUTG: '/gaskets/putg' as const,
	},
	Rings: {
		Base: '/rings' as const,
		Single: '/rings/single' as const,
		Kit: '/rings/kit' as const,
	},
	Orders: '/orders' as const,
	Manager: {
		Base: '/manager' as const,
		Orders: {
			Base: '/manager/orders' as const,
			Order: '/manager/orders/:id' as const,
			List: '/manager/orders/list' as const,
		},
		Analytics: {
			Base: '/manager/analytics' as const,
			Users: '/manager/analytics/users' as const,
			Orders: '/manager/analytics/orders' as const,
			Count: '/manager/analytics/count' as const,
			User: '/manager/analytics/user' as const,
		},
	},
})

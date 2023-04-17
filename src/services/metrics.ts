type Type = 'hit' | 'reachGoal'

export const sendMetric = (type: Type, value: string) => {
	;(window as any).ym(93215130, type, value)
}

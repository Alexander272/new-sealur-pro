export interface IMounting {
	id: string
	title: string
}

export interface IHasMounting {
	hasMounting: boolean
	mounting: IMounting
}

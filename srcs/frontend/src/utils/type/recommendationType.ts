export type recommendationT = {
	id: number,
	username: string,
	mutual_friends: mutualT[],
	mutuals : number,
}

type mutualT = {
	id: number,
	username: string,
}
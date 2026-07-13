export type achievementArrT = {
	id: number,
	username: string,
	elo: number,
};

export type achievementRetT = {
	achievement: achievementArrT[],
	user_rank : {id: number, username: string, elo: number, rank: number }
}
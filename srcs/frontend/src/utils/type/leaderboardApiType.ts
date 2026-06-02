export type leaderboardArrT = {
	id: number,
	username: string,
	elo: number,
};

export type leaderboardRetT = {
	leaderboard: leaderboardArrT[],
	user_rank : {id: number, username: string, elo: number, rank: number }
}
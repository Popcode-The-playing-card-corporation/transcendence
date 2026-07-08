export type userLB = {
  username: string;
  score: number;
  id: number
  rank: number;
};

export type currentLB = {
	username: string,
	score: number;
	rank: number;
}

export type leaderboardT = {
  leaderboard: userLB[];
  current: currentLB;
};

export const defaultLeaderboard:leaderboardT = {
	leaderboard: [],
	current: {username: "", score:0, rank: 0}
}

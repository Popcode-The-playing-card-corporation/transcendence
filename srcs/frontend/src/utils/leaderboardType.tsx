type userLB = {
  username: string;
  score: number;
};
type currentLB = {
	username: string,
	score: number;
	rank: number;
}

export type leaderboardT = {
  leaderboard: userLB[];
  current: currentLB;
};

export type achievement = {
  img: string;
  title: string;
  description: string,
  value: number,
  max_value: number,
  is_unlock: boolean,
  rate: number
};

export type currentAC = {
	username: string,
	score: number;
	rank: number;
}

export type achievementT = {
  achievement: userLB[];
  current: currentLB;
};

export const defaultachievement:achievementT = {
	achievement: [],
}
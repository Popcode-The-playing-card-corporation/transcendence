export type achievement = {
  code:string,
  img: string;
  title: string;
  description: string,
  value: number,
  max_value: number,
  is_unlock: boolean,
  rate: number
};

export type achievementT = {
  achievement: achievement[];
};

export const defaultachievement:achievementT = {
	achievement: [],
}

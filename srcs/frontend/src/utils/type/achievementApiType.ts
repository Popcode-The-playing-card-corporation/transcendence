
export type achievementArrT = {
  img: string;
  title: string;
  description: string,
  value: number,
  max_value: number,
  is_unlock: boolean,
  rate: number
};

export type achievementRetT = {
	achievement: achievementArrT[]
}
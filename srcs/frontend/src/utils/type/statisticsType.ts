export type statisticsT = {
  user: number;
  win: number;
  lose: number;
  played: number;
  total_points: number;
  nb_taken: number
  nb_last_take: number;
  nb_trick_choose: number;
  prefered_trick: string;
  tricks: number;
  hand_meld_points: number;
  board_meld_points: number;
  highest_hand_meld: number;
  highest_board_meld: number;
  nb_host: number;
};

export const defaultStat:statisticsT = {
  user: 0,
  win: 0,
  lose: 0,
  played: 0,
  total_points: 0,
  nb_taken: 0,
  nb_last_take: 0,
  nb_trick_choose: 0,
  prefered_trick: "",
  tricks: 0,
  hand_meld_points: 0,
  board_meld_points: 0,
  highest_hand_meld: 0,
  highest_board_meld: 0,
  nb_host: 0,
};
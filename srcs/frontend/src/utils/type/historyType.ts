import type { playerT } from "./playerType";

export type historyT = {
  game_id: string;
  start: string;
  points: number;
  rank: number;
  won: boolean;
  duration: number;
  nb_player: number;
  players: playerT[];
};


export const defaultHistory:historyT = {
  game_id: "",
  start: "",
  points: 0,
  rank: 0,
  won: false,
  duration: 0,
  nb_player: 0,
  players: []
};
import type { playerT } from "./playerType";

export type historyT = {
  game_id: number;
  start: string;
  points: number;
  rank: number;
  won: boolean;
  duration: number;
  nb_player: number;
  players: playerT[];
};

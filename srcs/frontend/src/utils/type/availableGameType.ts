import type { playerT } from "./playerType";

export type availableGameT = {
  id: number;
  code: string;
  type: string;
  nb_player: number;
  max_player: number;
  list_player: playerT[];
  host: string;
};

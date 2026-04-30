import type { accountT } from "./accountType";

export type historyT = {
  gameId: number;
  date: string;
  points: number;
  winned: boolean;
  timePlayed: string;
  nbPlayers: number;
  players: accountT[];
};

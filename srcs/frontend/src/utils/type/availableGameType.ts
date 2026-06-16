type gamePlayerT = {
	id: number;
	username: string;
}

export type availableGameT = {
  id: number;
  code: string;
  type: string;
  is_friend: boolean
  nb_player: number;
  max_player: number;
  list_player: gamePlayerT[];
  host: gamePlayerT;
};

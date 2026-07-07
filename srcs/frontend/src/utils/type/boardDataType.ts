import type { cardT } from "./handCardsType"
import type { playerT } from "./playerType";

export type SettingsT = {
	mode: number;
	maxSize: number;
	listPlayer: playerT[];
	timeout: Date;
	goal:string;
	nb_games:number;
	nb_points:number;
}

export type annonceT = {
	username: string,
    room_id: number,
    cards: cardT[][],
}

export type selfAnnonceT = {
	cards: number[],
	points: number,
}

export type selfCardT = {
	hand:cardT[],
	legal: boolean[],
	melds: selfAnnonceT[]
}

export type GameT = {
	boardData: boardDataT;
	self_cards: selfCardT;
}

export type playerScoreT = {
	room_id: number,
	user_id: number
	username: string,
	score: number,
}

export type DetailedPointsT = {
  rounds: {players: playerScoreT[]}[];
  is_finished: boolean;
  total: playerScoreT[];
};

export type playerGameT = {
	room_id: number,
	hand: number,
	user: { id: number, username: string, avatar: string},
}

export type boardT = {
	room_id: number;
	card: cardT;
}

export type lastFoldT = {
	username:string;
	room_id: number;
	cards: cardT[];
}


export type boardDataNT = {
	self_id: number,
	board: boardT[],
	lastCard: cardT | null,
	asked: cardT,
	trick: string | null,
	points: playerScoreT[],
	annonces: annonceT[]
	detailed_points: DetailedPointsT[];
	playing: number,
	player_list: playerGameT[],
	started_at: string,
	round_time: string,
	round: number,
	last_fold: lastFoldT,
	game: number;
}

export const default_board : boardDataNT = {
	self_id: -1,
	board: [],
	lastCard: null,
	asked: {color: "", value:"", id:0},
	trick: null,
	points: [],
	annonces: [],
	detailed_points: [],
	playing: -1,
	player_list: [],
	started_at: "",
	round_time: "",
	round: 0,
	last_fold: {username:"", room_id: -1, cards: []},
	game: 0,
}

export type boardDataT = {
	self_id: number,
	board: boardT[],
	lastCard: cardT | null,
	asked: cardT,
	trick: string | null,
	points: playerScoreT[],
	annonces: annonceT[]
	detailed_points: DetailedPointsT[];
	playing: number,
	player_list: playerGameT[],
	started_at: Date,
	round_time: Date,
	round: number,
	last_fold: lastFoldT,
	game: number;
}

export const default_Nboard : boardDataT = {
	self_id: -1,
	board: [],
	lastCard: null,
	asked: {color: "", value:"", id:0},
	trick: null,
	points: [],
	annonces: [],
	detailed_points: [],
	playing: -1,
	player_list: [],
	started_at: new Date(0,0,0),
	round_time: new Date(0,0,0),
	round: 0,
	last_fold: {username:"", room_id: -1, cards: []},
	game: 0,
}

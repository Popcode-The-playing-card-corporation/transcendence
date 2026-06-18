import type { cardType } from "./handCardsType"

type playerScoreT = {
	id: number,
	username: string,
	score: number,
}

export type DetailedPointsT = {
  rounds: {players: playerScoreT[]}[];
  is_finished: boolean;
  total: playerScoreT[];
};

type playerGameT = {
	hand: number,
	user: { id: number, username: string, avatar: string},
}

export type boardDataNT = {
	self_id: number,
	board: {room_id: number, card: cardType}[],
	asked: cardType,
	points: { id:number, username:string, score:number }[],
	detailed_points: DetailedPointsT[];
	playing: number,
	player_list: { [k: string] : playerGameT},
	started_at: string,
	round_time: string,
	round: number,
	last_fold: cardType[],
}

export const default_board : boardDataNT = {
	self_id: -1,
	board: [],
	asked: {color: "", value:"", id:0},
	points: [],
	detailed_points: [],
	playing: -1,
	player_list: {},
	started_at: "",
	round_time: "",
	round: 0,
	last_fold: [],
}

export type boardDataT = {
	self_id: number,
	board: {room_id: number, card: cardType}[],
	asked: cardType,
	points: { id:number, username:string, score:number }[],
	detailed_points: DetailedPointsT[];
	playing: number,
	player_list: { [k: string] : playerGameT},
	started_at: Date,
	round_time: Date,
	round: number,
	last_fold: cardType[],
}

export const default_Nboard : boardDataT = {
	self_id: -1,
	board: [],
	asked: {color: "", value:"", id:0},
	points: [],
	detailed_points: [],
	playing: -1,
	player_list: {},
	started_at: new Date(0,0,0),
	round_time: new Date(0,0,0),
	round: 0,
	last_fold: [],
}
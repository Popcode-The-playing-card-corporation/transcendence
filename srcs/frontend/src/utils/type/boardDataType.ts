import type { cardType } from "./handCardsType"

type playerScoreT = {
	id: number,
	username: string,
	score: number,
}

type playerGameT = {
	hand: number,
	user: { id: number, username: string, avatar: string},
}

export type boardDataT = {
	self_id: number,
	board: {room_id: number, card: cardType}[],
	asked: cardType,
	points: { [ k: number ]: number }[],
	detailed_points: { [k: number] : {[k : number] : playerScoreT[]}[]}[]
	playing: number,
	player_list: playerGameT[],
	started_at: string,
	round_time: string,
	round: number,
	last_fold: cardType[],
}

export const default_board : boardDataT = {
	self_id: 0,
	board: [],
	asked: {color: "", value:"", id:0},
	points: [],
	detailed_points: [],
	playing: 0,
	player_list: [],
	started_at: "",
	round_time: "",
	round: 0,
	last_fold: [],
}

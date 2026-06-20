import { type boardDataT, type boardDataNT, default_Nboard } from "../../../utils/type/boardDataType";
import type { cardType } from "../../../utils/type/handCardsType";
import type { playerT } from "../../../utils/type/playerType";

type SettingsT = {
	mode: number;
	maxSize: number;
	listPlayer: playerT[];
	timeout: Date;
	goal:string;
	nb_games:number;
	nb_points:number;
}

type GameT = {
	boardData: boardDataT;
	self_cards: {hand:cardType[], legal:cardType[], melds:{cards: number[], point:number}[]};
}

export type roomT = "private" | "friends_only" | "public"

export type paramsT = {
	max_player: number;
	type: roomT;
	timestamp: string;
	goal:string;
	nb_games:number;
	nb_points:number;
}

export type GameState = {

	connected: boolean;
	settings: SettingsT;
	game: GameT;
	messages: {type:string, user:{id:number, username:string, avatar:string}, message:string,time:string}[];
	event: string;
	eventID: number;
	message: string;
	user: string

}

export type GameAction =
	| { type: "CONNECTED" }
	| { type: "DISCONNECTED" }
	| { type: "SET_PLAYERS"; payload: playerT[] }
	| { type: "SET_CARDS"; payload: {hand:cardType[], legal:cardType[], melds:{cards: number[], point:number}[]} }
	| { type: "SET_BOARD"; payload: boardDataNT }
	| { type: "SET_PARAMS"; payload: paramsT }
	| { type: "SET_MODE"; payload: number }
	| { type: "SET_SIZE"; payload: number }
	| { type: "SET_HISTORY"; payload: {type:string, user:{id:number, username:string, avatar:string}, message:string,time:string}[]}
	| { type: "ADD_MESSAGE"; payload: {type:string, user:{id:number, username:string, avatar:string}, message:string,time:string}}
	| { type: "SET_USER"; payload: string}
	| { type: "SET_EVENT"; payload: string}
	| { type: "SET_MESSAGE"; payload:string}
	| { type: "SET_GOAL"; payload:string}
	| { type: "SET_NBGAME"; payload:number}
	| { type: "SET_NBPOINT"; payload:number}



export const initialState: GameState = {
	connected: false,
	settings: {
		mode: 0,
		maxSize: 2,
		listPlayer: [],
		timeout: new Date(0,0,0),
		goal: "games",
		nb_games: 3,
		nb_points:333,
	},
	game: {
		boardData: default_Nboard,
		self_cards:{hand:[], legal:[], melds:[{cards:[],point:0}]},
	},
	messages: [],
	event:"",
	eventID:0,
	message:"",
	user: ""
}

import { default_board, type boardDataT } from "../../../utils/type/boardDataType";
import type { cardType } from "../../../utils/type/handCardsType";
import type { playerT } from "../../../utils/type/playerType";

type SettingsT = {
	mode: number;
	maxSize: number;
	listPlayer: playerT[];
	timeout: Date;
}

type GameT = {
	boardData: boardDataT;
	self_cards: cardType[];
}

export type roomT = "private" | "friends_only" | "public"

export type paramsT = {
	max_player: number;
	type: roomT;
	timestamp: string;
}

export type GameState = {

	connected: boolean;
	settings: SettingsT;
	game: GameT;

}

export type GameAction =
	| { type: "CONNECTED" }
	| { type: "DISCONNECTED" }
	| { type: "SET_PLAYERS"; payload: playerT[] }
	| { type: "SET_CARDS"; payload: cardType[] }
	| { type: "SET_BOARD"; payload: boardDataT }
	| { type: "SET_PARAMS"; payload: paramsT }
	| { type: "SET_MODE"; payload: number }
	| { type: "SET_SIZE"; payload: number }


export const initialState: GameState = {
	connected: false,
	settings: {
		mode: 0,
		maxSize: 2,
		listPlayer: [],
		timeout: new Date(0,0,0)
	},
	game: {
		boardData: default_board,
		self_cards:[],
	},
}

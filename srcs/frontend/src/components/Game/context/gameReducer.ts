import type { GameAction, GameState, roomT } from "./GameType";

function getTime(datetime:string) {
	const dateTimeParts = datetime.split(' ');
	const time = dateTimeParts[1].split(':');
	const date = dateTimeParts[0].split('-');
	const res = new Date(Number(date[0]), Number(date[1]) - 1, Number(date[2]), Number(time[0]), Number(time[1]), Number(time[2]))
	return res;
}

function roomToMode(type: roomT) {
	switch (type) {
		case "private":
			return 0;
		case "friends_only":
			return 1;
		case "public":
			return 2;
	}
}

export function gameReducer( state: GameState, action: GameAction): GameState {
	
	switch (action.type) {
		case "CONNECTED":
			return {...state, connected:true};
		case "DISCONNECTED":
			return {...state, connected:false};
		case "SET_PLAYERS":
			return {...state , settings:
				{...state.settings, listPlayer: action.payload}};
		case "SET_CARDS":
			return {...state , game:
				{...state.game, self_cards: action.payload}};
		case "SET_BOARD":
			return {...state , game:
				{...state.game, boardData: action.payload}};
		case "SET_PARAMS":
			return {...state , settings:
				{...state.settings, maxSize: action.payload.max_player, 
					mode: roomToMode(action.payload.type), timeout: getTime(action.payload.timestamp)}};
		case "SET_MODE":
			return {...state , settings:
				{...state.settings, mode: action.payload}};
		case "SET_SIZE":
			return {...state , settings:
				{...state.settings, maxSize: action.payload}};

		default:
			return state;
	}
}
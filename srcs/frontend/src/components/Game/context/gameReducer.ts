import type { GameAction, GameState, roomT } from "./GameType";

function getTime(datetime:string) {
	if (datetime === "" || !datetime) {
		return new Date(0,0,0);
	}
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
				{...state.game, boardData:
					{...action.payload, started_at:getTime(action.payload.started_at), round_time:getTime(action.payload.round_time)}}};
		case "SET_PARAMS":
			return {...state , settings:
				{...state.settings, maxSize: action.payload.max_player, 
					mode: roomToMode(action.payload.type), timeout: getTime(action.payload.timestamp), goal: action.payload.goal}};
		case "SET_GOAL":
			return {...state , settings:
				{...state.settings, goal: action.payload}};
		case "SET_NBGAME":
			return {...state , settings:
				{...state.settings, nb_games: action.payload}};
		case "SET_NBPOINT":
			return {...state , settings:
				{...state.settings, nb_points: action.payload}};
		case "SET_MODE":
			return {...state , settings:
				{...state.settings, mode: action.payload}};
		case "SET_SIZE":
			return {...state , settings:
				{...state.settings, maxSize: action.payload}};
		
		case "SET_HISTORY":
			return {...state, messages:action.payload};

		case "ADD_MESSAGE":
			return {...state, messages: [...state.messages, action.payload]};

		case "SET_USER":
			return {...state, user: action.payload};

		case "SET_EVENT":
			return {...state, event: action.payload, eventID: state.eventID + 1};
		
		case "SET_MESSAGE":
			return {...state, message: action.payload};

		case "SET_CODE":
			return {...state, new_code: action.payload};

		case "SET_NEXT":
			return {...state, next: action.payload};

		case "SET_HOST":
			return {...state, host: action.payload};

		case "SET_WAIT":
			return {...state, wait: action.payload}

		case "TEST_ANNONCES":
			return {...state, show_annonces: !state.show_annonces};

		default:
			return state;
	}
}

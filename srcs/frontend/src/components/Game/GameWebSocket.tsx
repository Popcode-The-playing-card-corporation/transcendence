import WaitingRoom from "./waitingRoom/WaitingRoom";
import GameMain from "./Game/GameMain";
import useWebSocketModule from "react-use-websocket";
import host from "../../api/http/host";
import { useAuth } from "../hooks/useAuth";
import { useNotif } from "../hooks/useNotif";
import { useEffect, useReducer, type SetStateAction } from "react";
import { gameReducer } from "./context/gameReducer";
import { initialState, type paramsT } from "./context/GameType";
import { useNavigate } from "react-router";
import { GameContext } from "./context/GameContext";
import type { playerT } from "../../utils/type/playerType";
import type { cardT } from "../../utils/type/handCardsType";
import type { boardDataNT, selfAnnonceT } from "../../utils/type/boardDataType";
import ModalRejoinGame from "./createOrJoin/ModalRejoinGame";

export default function GameWebSocket({
  code,
  setCode,
}: {
  code: string;
  setCode: React.Dispatch<SetStateAction<string>>;
}) {
  const notif = useNotif();
  const auth = useAuth();
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("code", code);
  }, [code]);

  function leaveRoom() {
    localStorage.removeItem("code");
    setCode("");
	auth.setGame(false);
  }

  const { default: useWebSocket = useWebSocketModule } =
    useWebSocketModule as unknown as {
      default: typeof useWebSocketModule;
    };

  const { sendJsonMessage } = useWebSocket(
    auth.logged_in ? host.ws + "room/" + code + "/" : null,
    {
      shouldReconnect: (event) => {
        if (event.code === 4001) {
          leaveRoom();
          return false;
        } else if (event.code === 4003) {
          leaveRoom();
          navigate("/");
          return false;
        } else if (event.code === 4008) {
          leaveRoom();
		  notif?.showNotif("Room Inaccessible", "Fix your relationship with a user in this room to join it", 5000)
          return false;
        }
        return auth.logged_in ? true : false;
      },
      reconnectAttempts: 30,
      reconnectInterval: 1000,
      heartbeat: {
        message: JSON.stringify({ type: "heartbeat" }),
        returnMessage: JSON.stringify({ type: "acknowledge" }),
        interval: 30000,
        timeout: 60000,
      },

      onOpen: () => {
        dispatch({ type: "CONNECTED" });
      },

      onClose: (event) => {
        dispatch({ type: "DISCONNECTED" });
		auth.setGame(false)
		if (event.code === 4001) {
			leaveRoom();
			navigate("/");
			notif?.showNotif("Forced Disconnection", "You have been disconnected from your game, to rejoin click on the game tab", 5000);
		}
      },

      onMessage: (event) => {
        const data = JSON.parse(event.data);
        if (data.type == "acknowledge") {
          return;
        }
        const payload = data.payload;

			if (data.type === "global") {
				if (data.event == "set_user") {
					dispatch({type: "SET_USER", payload: data.username})
				}
			} else if (data.type === "settings") {
				dispatch({type:"SET_EVENT", payload: data.event});
				dispatch({type:"SET_CODE", payload:null})
				dispatch({type:"SET_NEXT", payload:null})
				if (data.event === "player_kicked") { // Error case????
					if (payload.message) {
						if (payload.message === "You have been kicked from the room") {
							leaveRoom();
							notif?.showNotif("Kicked!", "You have been kicked from the room.", 5000);
						}
					} else {
						notif?.showNotif("Player left", "A player has been kicked from the room", 5000);
						setSettings(payload.players, payload.params);
					}
				} else if (data.event === "room_closed") {
					leaveRoom();
					notif?.showNotif("Room Closed", "The lobby has timed out, create or join a new one", 5000);
				} else {
					setSettings(payload.players, payload.params);
				}
				
			} else if (data.type === "game") {
				dispatch({type:"SET_EVENT", payload: data.event});
				auth.setGame(true);
				if (data.event === "annonces_valid") {
					if (data.valid === false) {
						dispatch({type:"SET_EVENT", payload: "false"});
						dispatch({type:"SET_MESSAGE", payload: data.message});
					}
				} else if (data.event === "card_valid") {
					if (payload.status === "invalid") {
						dispatch({type:"SET_MESSAGE", payload: "invalid"});
					} else {
						setGame(payload.self_card, payload.board_data)
					}
				} else if (data.event === "game_ended" || data.event === "force_disconnect") {
					auth.setGame(false);
					leaveRoom();
				} else if (data.event === "new_room") {
					if (state.host === state.user) {
						dispatch({type:"SET_HOST", payload:payload.host})
						setCode(payload.code)
					}
					dispatch({type:"SET_CODE", payload: payload.code})
					dispatch({type: "SET_NEXT", payload:true})
				} else {
					if (data.event === "player_disconnect" || data.event === "player_reconnect") {
						if (data.event === "player_disconnect") {
							if (state.settings.listPlayer.filter((player) => player.username === data.playername)[0].is_host) {
								dispatch({type: "SET_NEXT", payload:false})
							}
						}
						dispatch({type:"SET_MESSAGE", payload: data.player_name});
					}
					if (payload.board_data) {
						setGame(payload.self_card, payload.board_data)
						dispatch({type:"SET_HOST", payload: payload.board_data.host})
						dispatch({type:"SET_USER", payload: payload.board_data.user})
					}
				}
			} else if (data.event === "error" || data.type === "error") {
				if (data.message === "Need 2 players") {
					notif?.showNotif("Game Error", "At least 2 players needed to start game", 5000);
				} else {
					console.debug("Error:", data.message);
					notif?.showNotif("Game Error", data.message, 5000);
				}
			} else {
				console.debug("Unknown event: ", data)
			}

		},
	
	});

		function setSettings(players:playerT[], params:paramsT) {
			dispatch({type:"SET_PARAMS", payload:params})
			dispatch({type:"SET_PLAYERS", payload:players})
			if (params.goal === "games") {
				dispatch({type:"SET_NBGAME", payload:params.nb_games});
			} else {
				dispatch({type:"SET_NBPOINT", payload:params.nb_points});
			}
		}

		function setGame(cards:{hand:cardT[], legal:boolean[], melds:selfAnnonceT[]}, board:boardDataNT) {
			dispatch({type:"SET_CARDS", payload:cards})
			dispatch({type:"SET_BOARD", payload:board})
		}

		function sendJson(action:string, message?:object) {
			sendJsonMessage({type: "action", action: action, payload: message })
		}

		function startGame() {
			sendJson("start_game");
		}

		function playCard(cardId:number) {
			sendJson("play_card", {cardId: cardId});
		}

		function continueGame() {
			sendJson("continue");
		}

		function endGame() {
			sendJson("end_game");
		}

		function exitGame() {
			sendJson("exit_game")
			leaveRoom();
			auth.setGame(false);
			notif?.showNotif("Left Game", "You have left the game and can no longer rejoin the lobby.")
		}

		function annonces(cards: {cardId:number}[]) {
			sendJson("melds", {cards:cards});
		}

		function kickPlayer(playerId:number) { //RoomId of player/ position
			sendJson("kick", {playerId : playerId});
		}

		function sendParams(params:object) {
			sendJson("patch_param", params);
		}


	function setSize(size: number) {
		dispatch({ type: "SET_SIZE", payload: size})
	}

	function setMode(mode: number) {
		dispatch({ type: "SET_MODE", payload: mode})
	}

	function setGoal(goal: string) {
		dispatch({type: "SET_GOAL", payload:goal});
	}

	function setNBGames(games: number) {
		dispatch({type: "SET_NBGAME", payload:games});
	}

	function setNBPoints(points: number) {
		dispatch({type: "SET_NBPOINT", payload:points});
	}		
	
	function show_annonces() {
		dispatch({type: "TEST_ANNONCES"});
	}

	function nextGame(new_code:string) {
			setCode(new_code);
	}

	function setWait(bool:boolean) {
		dispatch({type:"SET_WAIT", payload:bool})
	}
	
	const { sendJsonMessage: sendChatJsonMessage } = useWebSocket(auth.logged_in && auth.in_game ? (host.ws + "chat/" + code + '/') : null, {
		shouldReconnect: () => {
			return auth.logged_in && auth.in_game ? true : false
		},
		reconnectAttempts: 30,
		reconnectInterval: 1000,
		
		heartbeat: {
			message: JSON.stringify({ type: "heartbeat" }),
			returnMessage: JSON.stringify({ type: "acknowledge" }),
			interval: 30000,
			timeout: 60000,
		},

		onOpen: () => {
		},

		onClose: () => {
		},

		onMessage: (event) => {
			const data = JSON.parse(event.data);
			if (data.type == "acknowledge") {
				return
			}
			const payload = data.payload;

			if (data.type === "chat_message") {
				dispatch({type: "ADD_MESSAGE", payload: payload})
			} else if (data.type === "history") {
				dispatch({type: "SET_HISTORY", payload: payload})
			} else if (data.event === "error") {
				console.debug("Error: ", data)
			} else {
				console.debug("Unknown event: ", data)
			}
		},

	});

	function sendMessage(action:string, message:string) {
		sendChatJsonMessage({type: action, message: message});
	}

	if (state.connected === false)
	  return (
		<div className="page-content flex items-center justify-center min-h-screen">
			<span className="loading loading-spinner loading-xl"></span>
		</div>)

	
	return (
		<GameContext.Provider value={{state, setWait, nextGame, sendParams, show_annonces, leaveRoom, startGame, exitGame, playCard, continueGame, endGame, annonces, kickPlayer, setMode, setSize, setGoal, setNBGames, setNBPoints, sendMessage}}>
		<ModalRejoinGame />
		{auth.in_game ? <GameMain /> : <WaitingRoom roomCode={code}/>}
		</GameContext.Provider>
	);
}

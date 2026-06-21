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
import type { cardType } from "../../utils/type/handCardsType";
import type { boardDataNT } from "../../utils/type/boardDataType";

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

      onClose: () => {
        dispatch({ type: "DISCONNECTED" });
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
				} else if (data.event === "game_ended") {
					auth.setGame(false);
					leaveRoom();
				} else {
					if (data.event === "player_disconnect" || data.event === "player_reconnect") {
						dispatch({type:"SET_MESSAGE", payload: data.player_name});
					}
					setGame(payload.self_card, payload.board_data)
				}
			} else if (data.event === "error") {
				notif?.showNotif("Game Error", data.message);
			} else {
				console.debug("Unknown event: ", data)
			}

			notif?.showNotif(data.event, state.message === "" ? "No message" : state.message, 5000);
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

		function setGame(cards:{hand:cardType[], legal:cardType[], melds:{cards: number[], point:number}[]}, board:boardDataNT) {
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
	
	const { sendJsonMessage: sendChatJsonMessage } = useWebSocket(auth.logged_in  && auth.in_game ? (host.ws + "chat/" + code + '/') : null, {
		shouldReconnect: () => {
			return auth.logged_in ? true : false
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
				console.debug("chat_message: ", payload)
			} else if (data.type === "history") {
				dispatch({type: "SET_HISTORY", payload: payload})
				console.debug("history", payload)
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
		<GameContext.Provider value={{state, leaveRoom, startGame, exitGame, playCard, continueGame, endGame, annonces, kickPlayer, setMode, setSize, setGoal, setNBGames, setNBPoints, sendMessage}}>
		{auth.in_game ? <GameMain /> : <WaitingRoom roomCode={code}/>}
		</GameContext.Provider>
	);
}
import WaitingRoom from "./waitingRoom/WaitingRoom";
import GameMain from "./Game/GameMain";
import useWebSocketModule from "react-use-websocket";
import host from "../../api/http/host";
import { useAuth } from "../hooks/useAuth";
import { useNotif } from "../hooks/useNotif";
import { useEffect, useReducer, type SetStateAction } from "react";
import { gameReducer } from "./context/gameReducer";
import { initialState } from "./context/GameType";
import { useNavigate } from "react-router";
import { GameContext } from "./context/GameContext";

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
				if (data.event === "host_join") {
					//
				} else if (data.event === "player_join") {
					//
				} else if (data.event === "settings_changed") {
					//
				} else if (data.event === "bot_added") {
					//
				} else if (data.event === "player_kicked") {
					//
				}
			} else if (data.type === "game") {
				if (data.event === "game_started") {
					//
				} else if (data.event === "annonces_valid") { // where you tell me if valid or not
					//
				} else if (data.event === "card_valid") {
					//
				} else if (data.event === "finish_round") {
					//
				} else if (data.event === "game_finish") {
					//
				} else if (data.event === "game_continued") {
					//
				} else if (data.event === "game_ended") {
					//
				} else if (data.event === "player_replace") {
					//
				} else if (data.event === "player_reconnect") {
					//
				}
			} else if (data.event === "board_data") {
				dispatch({ type: "SET_BOARD", payload: payload});
				auth.setGame(true);
			} else if (data.type === "game_started") {
				auth.setGame(true);
			} else if (data.event === "error") {
				notif?.showNotif("Game Error", data.message);
			} else if (data.event === "update" && data.type === "list_player") {
				dispatch({type:"SET_PLAYERS", payload: payload.players})
			} else {
				console.debug("Unknown event: ", data)
			}
		},
	
	});

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

		function annonces(cards: number[]) {
			const parsed_cards:{cardId:number}[] = [];
			cards.forEach((card) => {
				parsed_cards.push({cardId: card})
			})
			sendJson("melds", parsed_cards);
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
		<GameContext.Provider value={{state, leaveRoom, startGame, playCard, continueGame, endGame, annonces, kickPlayer, setMode, setSize, sendMessage}}>
		{auth.in_game ? <GameMain /> : <WaitingRoom roomCode={code}/>}
		</GameContext.Provider>
	);
}